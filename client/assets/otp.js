document.addEventListener('DOMContentLoaded', () => {
  const otpForm = document.querySelector('#otpForm');

  otpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(otpForm);
    const options = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: localStorage.getItem('username'),
        otp: formData.get('otp')
      })
    };

    try {
      const response = await fetch('http://localhost:3000/auth/verify', options);
      const data = await response.json();
      console.log("Login response:", data);

      // Check that the token exists
      if (data.token) {
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        localStorage.removeItem('username');
        
        console.log("Token saved to localStorage:", localStorage.getItem('token'));

        // Redirect after saving
        alert('Successfully Logged In');
        window.location.assign("maindashboard.html");
      } else {
        alert(data.error || "Login failed: no token received");
      }
    } catch (err) {
      console.error(err);
      alert("Network error: " + err.message);
    }
  });

  const resendLink = document.getElementById('resendOTP');
  if (resendLink) {
    resendLink.addEventListener('click', async (e) => {
      e.preventDefault();

      const username = localStorage.getItem('username');
      if (!username) {
        alert('No username found. Please log in again.');
        return;
      }

      try {
        const options = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username })
        };

        const resp = await fetch('http://localhost:3000/auth/sendOtp', options);
        const data = await resp.json();

        if (!resp.ok) {
          console.error('Resend OTP error:', data);
          alert((data && data.error) || 'Failed to resend OTP.');
          return;
        }

        alert('A new OTP has been sent to your email.');
      } catch (err) {
        console.error('Resend failed:', err);
        alert('Something went wrong. Please try again.');
      }
    });
  }
  
});