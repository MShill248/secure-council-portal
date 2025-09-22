document.addEventListener("DOMContentLoaded", () => {
    const resetMethod = document.getElementById("resetMethod")
    const currentEmailInput = document.getElementById("EmailAddress")
    const currentUsername = document.getElementById("Username")
    const passwordSection = document.getElementById("password-section")
    const otpSection = document.getElementById("otp-section")
    const sendOtpBtn = document.getElementById("sendOtpBtn")

    const currentPasswordInput = document.getElementById("currentPassword")
    const otpInput = document.getElementById("otpCode")
    const newPasswordInput = document.getElementById("newPassword")
    const confirmPasswordInput = document.getElementById("confirmNewPassword")

    const changeBtn = document.querySelector(".btn-success")
    const cancelBtn = document.getElementById("cancelBtn")

    resetMethod.addEventListener("change", () => {
        if (resetMethod.value === "password") {
            passwordSection.classList.remove("d-none")
            otpSection.classList.add("d-none")
        } else {
            otpSection.classList.remove("d-none")
            passwordSection.classList.add("d-none")
        }
    })

    async function loadUser() {
        try {
            const options = {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("token"),
                },
            }
            const response = await fetch("http://localhost:3000/user/account", options);
            
            if (!response.ok) {
                throw new Error("Failed to fetch user details")
            }

            const user = await response.json()
            currentEmailInput.value = user.email
            currentUsername.value = user.username
        } catch (err) {
            console.error("Error loading user details:", err)
        }
    }
    
    loadUser()

    sendOtpBtn.addEventListener("click", async () => {
        try {
            const username = currentUsername.value.trim()
            const response = await fetch("http://localhost:3000/auth/sendOtp", {
                method: "POST",
                headers: { 
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("token") 
                },
                body: JSON.stringify({ username })
            })

            if (!response.ok) {
                throw new Error("Failed to send OTP")
            }

            alert("OTP sent to your email.")
        } catch (err) {
            console.error(err)
            alert(err.message)
        }
    })

    async function verifyOtp(username, otp) {
        const response = await fetch("http://localhost:3000/auth/verify", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ username, otp })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || "OTP verification failed")
        }

        return data.token
    }

    async function verifyCurrentPassword(username, password) {
        const response = await fetch("http://localhost:3000/auth/verifyPassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })

        const data = await response.json()
        
        if (!response.ok) {
            throw new Error(data.error || "Current password incorrect")
        }

        return data.token
    }

    changeBtn.addEventListener("click", async () => {
        const method = resetMethod.value
        const newPassword = newPasswordInput.value.trim()
        const confirmPassword = confirmPasswordInput.value.trim()

        if (!newPassword || !confirmPassword) {
            alert("Please fill in all fields")
            return
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match")
            return
        }

        try {
            let token

            if (method === "password") {
                const currentPassword = currentPasswordInput.value.trim()
                if (!currentPassword) {
                    alert("Please enter your current password")
                    return
                }

                token = await verifyCurrentPassword(currentUsername.value.trim(), currentPassword)
            } else {
                const otp = otpInput.value.trim()
                if (!otp) {
                    alert("Please enter the OTP")
                    return
                }

                token = await verifyOtp(currentUsername.value.trim(), otp)
            }

            const response = await fetch("http://localhost:3000/user/update", {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({ password: newPassword })
            })

            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to update password")
            }

            alert("Password updated successfully. Please log in again.")
            localStorage.clear()
            window.location.assign("index.html")

        } catch (err) {
            console.error(err)
            alert(err.message)
        }
    })

    cancelBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.assign("maindashboard.html")
    })
})
