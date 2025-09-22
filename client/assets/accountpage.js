const logout = document.querySelector('#logout')
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("account-form");
  const editBtn = document.getElementById("editBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const deleteAlert = document.getElementById("deleteAlert");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const username = document.getElementById("username");
  const dob = document.getElementById("dob");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const postcode = document.getElementById("postcode");
  const borough = document.getElementById("borough");
  const address = document.getElementById("address");
  const welcomeU = document.getElementById("welcome-username");

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  // PHONE NUMBER VALIDATION
  const UK_MOBILE_REGEX = /^07\d{9}$/;
  if (phone) {
    phone.setAttribute("pattern", "^07\\d{9}$");
    phone.setAttribute("maxlength", "11");
    phone.setAttribute("minlength", "11");
    if (!phone.placeholder) phone.placeholder = "07XXXXXXXXX";
  }

  function setEditableFields(isEditing) {
    const alwaysReadOnly = [firstName, lastName, username, dob, email];
    for (let i = 0; i < alwaysReadOnly.length; i++) {
      const el = alwaysReadOnly[i];
      if (el) el.readOnly = true;
    }
    if (phone) phone.readOnly = !isEditing;
    if (address) address.readOnly = !isEditing;
    if (postcode) postcode.readOnly = !isEditing;
    if (borough) borough.readOnly = !isEditing;
  }

  setEditableFields(false);

  try {
    const options = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: token
      },
    };
    const res = await fetch("http://localhost:3000/user/account", options);
    if (!res.ok) throw new Error("Failed to load account");
    const user = await res.json();

    if (firstName)
      firstName.value = user && user.first_name ? user.first_name : "";
    if (lastName) lastName.value = user && user.last_name ? user.last_name : "";
    if (username) username.value = user && user.username ? user.username : "";

    if (dob) {
      if (user && user.dob) {
        dob.value = user.dob.slice(0, 10);
      } else {
        dob.value = "";
      }
    }

    if (email) email.value = user && user.email ? user.email : "";
    if (postcode) postcode.value = user && user.postcode ? user.postcode : "";
    if (borough) borough.value = user && user.borough ? user.borough : "";
    if (address) address.value = user && user.address ? user.address : "";

    if (phone) {
      if (user && user.phone) {
        phone.value = user.phone;
      } else if (user && user.phone_number) {
        phone.value = user.phone_number;
      } else {
        phone.value = "";
      }
    }

    if (welcomeU) {
      if (user && user.username) {
        welcomeU.textContent = user.username;
      } else {
        welcomeU.textContent = "User";
      }
    }
  } catch (err) {
    console.error(err);
  }

  editBtn.addEventListener("click", async () => {
    const isEditing = editBtn.dataset.mode === "editing";

    if (!isEditing) {
      setEditableFields(true);
      editBtn.textContent = "Save Changes";
      editBtn.dataset.mode = "editing";
      return;
    }

    if (phone) {
      const value = phone.value.trim();
      if (!UK_MOBILE_REGEX.test(value)) {
        phone.setCustomValidity(
          "Enter a valid UK mobile (starts with 07 and has 11 digits)."
        );
      } else {
        phone.setCustomValidity("");
      }
    }

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const payload = {
      phone_number: phone ? phone.value.trim() : "",
      address: address ? address.value.trim() : "",
    };

    try {
      const updateOpts = {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify(payload),
      };
      const updateRes = await fetch(
        "http://localhost:3000/user/update",
        updateOpts
      );
      let updateData = null;
      try {
        updateData = await updateRes.json();
      } catch (e) {
        updateData = null;
      }

      if (updateRes.ok) {
        setEditableFields(false);
        editBtn.textContent = "Edit Details";
        editBtn.dataset.mode = "";
        form.classList.remove("was-validated");
      } else {
        if (updateData && updateData.error) {
          alert(updateData.error);
        } else {
          alert("Failed to update details.");
        }
      }
    } catch (e) {
      console.error("Update failed:", e);
      alert("Something went wrong. Please try again.");
    }
  });

  deleteBtn.addEventListener("click", () => {
    deleteAlert.classList.remove("d-none");
  });

  cancelDeleteBtn.addEventListener("click", () => {
    deleteAlert.classList.add("d-none");
  });

  confirmDeleteBtn.addEventListener("click", async () => {
    try {
      const delOpts = {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: token,
        },
      };
      const delRes = await fetch("http://localhost:3000/user/delete", delOpts);
      if (delRes.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("userid");
        window.location.href = "index.html";
      } else {
        let delData = null;
        try {
          delData = await delRes.json();
        } catch (e) {
          delData = null;
        }
        if (delData && delData.error) {
          alert(delData.error);
        } else {
          alert("Failed to delete account.");
        }
      }
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Something went wrong. Please try again.");
    }
  });
});
