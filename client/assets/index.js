document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    };

    try {
      localStorage.setItem("username", formData.get("username"));
    } catch (err) {
      console.error("Failed to save username:", err);
    }

    try {
      const response = await fetch("http://localhost:3000/auth/login", options);
      const data = await response.json();
      console.log("Login response:", data);

      // Check that the username exists
      if (data.username) {
        // Save username to localStorage
        localStorage.setItem("username", data.username);

        console.log(
          "Username saved to localStorage:",
          localStorage.getItem("username")
        );

        // Redirect after saving
        alert("OTP has been sent");
        window.location.assign("otp.html");
      } else {
        alert(data.error || "Login failed: no username received");
      }
    } catch (err) {
      console.error(err);
      alert("Network error: " + err.message);
    }
  });
});
