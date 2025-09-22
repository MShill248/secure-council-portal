const logout = document.querySelector('#logout')
document.addEventListener("DOMContentLoaded", async () => {
  const accountForm = document.getElementById("account-form");
  const editBtn = document.querySelector(".btn-success");
  const deleteBtn = document.querySelector(".btn-danger");
  const formInputs = accountForm.querySelectorAll("input");

  try {
    const options = {
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "authorization": localStorage.getItem("token"),
        }
    }

    const response = await fetch("http://localhost:3000/user/account", options);
    if (!response.ok) throw new Error("Failed to fetch user details");
    const user = await response.json();

    document.getElementById("firstName").value = user.first_name;
    document.getElementById("lastName").value = user.last_name;
    document.getElementById("username").value = user.username;
    document.getElementById("dob").value = new Date(user.dob).toISOString().split('T')[0];
    document.getElementById("Email Address").value = user.email;
    document.getElementById("address").value = user.address;
    document.getElementById("postcode").value = user.postcode;
    document.getElementById("borough").value = user.borough;
    formInputs.forEach((input) => input.setAttribute("readonly", true));
  } catch (error) {
    console.error("Error loading user details:", error);
  }

editBtn.addEventListener("click", async () => {
    const isEditing = editBtn.textContent === "Edit Details";
    if (isEditing) {
        formInputs.forEach((input) => {
            if (
                input.id !== "firstName" &&
                input.id !== "lastName" &&
                input.id !== "username"
            ) {
                input.removeAttribute("readonly");
            }
        });
        editBtn.textContent = "Save Details";
    } else {
        const updatedUser = {};
        formInputs.forEach((input) => {
            if (
                input.id !== "firstName" &&
                input.id !== "lastName" &&
                input.id !== "username"
            ) {
                updatedUser[input.id] = input.value;
            }
        });

        try {
            const options = {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("token"),
                },
                body: JSON.stringify(updatedUser)
            }
            const response = await fetch("http://localhost:3000/user/update", options)
            if (!response.ok) throw new Error("Failed to update user details");
            formInputs.forEach((input) => input.setAttribute("readonly", true));
            editBtn.textContent = "Edit Details";
        } catch (error) {
            console.error("Error saving user details:", error);
            alert("Failed to save details. Please try again.");
        }
    }
    })

    deleteBtn.addEventListener("click", async () => {
    const isDeleting = deleteBtn.textContent === "Delete";

        try {
            const options = {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("token"),
                }
            }
            const response = await fetch("http://localhost:3000/user/delete", options)
            if (!response.ok) throw new Error("Failed to delete user details");
            formInputs.forEach((input) => input.setAttribute("readonly", true));
            deleteBtn.textContent = "Delete";
            window.location.assign("index.html") 
            alert("account deleted")
        } catch (error) {
            console.error("Error deleting user details:", error);
            alert("Failed to delete details. Please try again.");
        }
    })
    
})
logout.addEventListener('click', () => {
    localStorage.removeItem('token')
    window.location.assign('index.html')
})