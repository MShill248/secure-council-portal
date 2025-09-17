document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const options = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: formData.get('username'),
        password: formData.get('password')
      })
    };

    try {
      localStorage.setItem('username', formData.get('username'));
    } catch (err) {
      console.error("Failed to save username:", err);
    }

    try {
      const response = await fetch('http://localhost:3000/auth/login', options);
      const data = await response.json();
      console.log("Login response:", data);

      // Check that the token exists
      if (data.token) {
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userid', data.userid);
        
        console.log("Token saved to localStorage:", localStorage.getItem('token'));

        // Redirect after saving
        alert('Successfully Logged In');
        window.location.assign("homepage.html");
      } else {
        alert(data.error || "Login failed: no token received");
      }
    } catch (err) {
      console.error(err);
      alert("Network error: " + err.message);
    }
  });
});