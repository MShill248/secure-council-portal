const form = document.querySelector("#request-form");
const logout = document.querySelector("#logout");

form?.addEventListener("submit", onSubmit);

async function onSubmit(e) {
  e.preventDefault();

  // Bootstrap validation: block submit if invalid
  if (!form.checkValidity()) {
    e.stopPropagation();
    form.classList.add("was-validated");
    return;
  }

  // Optional: prevent double submit
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn?.setAttribute("disabled", "disabled");

  try {
    const fd = new FormData(form);

    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title: fd.get("Title"),
        description: fd.get("description"),
        status: "pending",
        category: fd.get("requestCategory"),
        priority: "1",
        type: fd.get("requestType"),
      }),
    };

    const response = await fetch("http://localhost:3000/request/", options);
    const data = await response.json().catch(() => ({}));

    // Success → go to dashboard
    if (response.status === 201 || response.ok) {
      window.location.assign("requestdashboard.html");
      return;
    }

    // Failure → show a friendly message
    const msg =
      data?.error ||
      data?.message ||
      "There was a problem submitting your request. Please try again.";
    alert(msg);
  } catch (err) {
    console.error("Submit failed:", err);
    alert("Network error. Please try again.");
  } finally {
    submitBtn?.removeAttribute("disabled");
  }
}

// Logout
logout?.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.assign("index.html");
});
