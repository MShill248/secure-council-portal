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
});