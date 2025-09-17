document.addEventListener("DOMContentLoaded", async () => {
  const accountForm = document.getElementById("account-form");
  const editBtn = document.querySelector(".btn-success");
  const formInputs = accountForm.querySelectorAll("input");

  try {
    const response = await fetch("/api/user", {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch user details");
    const user = await response.json();

    document.getElementById("firstName").value = user.firstName;
    document.getElementById("lastName").value = user.lastName;
    document.getElementById("username").value = user.username;
    document.getElementById("dob").value = user.dob;
    document.getElementById("email").value = user.email;
    document.getElementById("address").value = user.address;
    document.getElementById("postcode").value = user.postcode;
    document.getElementById("borough").value = user.borough;
    formInputs.forEach((input) => input.setAttribute("readonly", true));
  } catch (error) {
    console.error("Error loading user details:", error);
  }

  editBtn.addEventListener("click", async () => {
    const isEditing = editBtn.textContent === "Edit Details";

  });
});
