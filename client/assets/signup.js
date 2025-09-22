document.addEventListener("DOMContentLoaded", function () {
  const formEl = document.querySelector(".signup-form");
  if (!formEl) return;

  formEl.addEventListener("submit", async function (e) {
    const pwd = document.getElementById("password");
    const rePwd = document.getElementById("rePassword");
    if (pwd && rePwd) {
      if (rePwd.value !== pwd.value) {
        rePwd.setCustomValidity("Passwords do not match");
      } else {
        rePwd.setCustomValidity("");
      }
    }

    if (!formEl.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
      formEl.classList.add("was-validated");
      return;
    }

    e.preventDefault();
    formEl.classList.add("was-validated");

    const form = new FormData(formEl);

    const options = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first_name: form.get("firstName"),
        last_name: form.get("lastName"),
        email: form.get("email"),
        username: form.get("username"),
        password: form.get("password"),
        dob: form.get("dob"),
        address: form.get("address"),
        postcode: form.get("postcode"),
        borough: form.get("boroughs"),
        phone_number: form.get("phone"),
        user_role: form.get("userrole")
      })
    };

    try {
      const response = await fetch("http://localhost:3000/auth/register", options);
      const data = await response.json();

      if (response.status === 201) {
        window.location.assign("index.html");
      } else {
        alert(data && data.error ? data.error : "Failed to sign up.");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Something went wrong. Please try again.");
    }
  });
});
