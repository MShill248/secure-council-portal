document.addEventListener("DOMContentLoaded", async () => {
    const changeBtn = document.querySelector(".btn-success")
    const cancelBtn = document.querySelector(".btn-danger")
    const currentEmailInput = document.getElementById("EmailAddress")
    const newEmailInput = document.getElementById("NewEmail")
    const confirmEmailInput = document.getElementById("ConfirmNewEmail")
    const passwordInput = document.getElementById("password")

    async function loadUserEmail() {
        try {
            const options = {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("token")
                }
            };
            const response = await fetch("http://localhost:3000/user/account", options)
            if (!response.ok) throw new Error("Failed to fetch user details")
            const user = await response.json()
            currentEmailInput.value = user.email
        } catch (err) {
            console.error("Error loading user details:", err)
        }
    }

    loadUserEmail()

    changeBtn.addEventListener("click", async () => {
    const newEmail = newEmailInput.value.trim()
    const confirmEmail = confirmEmailInput.value.trim()
    const password = passwordInput.value.trim()

    if (!newEmail || !confirmEmail || !password) {
        alert("Please fill in both fields")
        return
    }

    if (newEmail !== confirmEmail) {
        alert("New email addresses don't match")
        return
    }

    try {
        const options = {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": localStorage.getItem("token"),
            },
            body: JSON.stringify({ email: newEmail })
        }

        const response = await fetch("http://localhost:3000/user/update", options)
        const data = await response.json()

        if (!response.ok) {
                throw new Error(data.error || "Failed to update email")
            }

        alert("Email updated successfully. Please log in again.")
        localStorage.clear()
        window.location.assign("index.html")

    } catch (error) {
        console.error("Error updating email:", error)
        alert(error.message)
    }
    })

    cancelBtn.addEventListener("click", (e) => {
        e.preventDefault()
        window.location.assign("maindashboard.html")
    })
})

