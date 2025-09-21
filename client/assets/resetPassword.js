document.addEventListener("DOMContentLoaded", () => {
    const sendOtpBtn = document.getElementById("sendOtpBtn")
    const resetPasswordBtn = document.getElementById("resetPasswordBtn")
    const requestOtpSection = document.getElementById("requestOtpSection")
    const resetSection = document.getElementById("resetSection")

    async function sendOtp(username) {
        const res = await fetch("http://localhost:3000/auth/sendOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
        })

        if (!res.ok) {
            throw new Error("Failed to send OTP")
        }
    }

    async function verifyOtp(username, otp) {
        const res = await fetch("http://localhost:3000/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, otp })
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error || "OTP verification failed")
        }

        return data.token
    }

    async function updatePassword(newPassword, token) {
        const res = await fetch("http://localhost:3000/user/update", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
        body: JSON.stringify({ password: newPassword })
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error || "Password update failed")
        }

        return data
    }

    sendOtpBtn.addEventListener("click", async () => {
        const username = document.getElementById("usernameInput").value.trim()

        if (!username) {
            alert("Please enter your username")
            return
        }
        
        try {
            await sendOtp(username)
            alert("OTP sent to your email")
            requestOtpSection.classList.add("d-none")
            resetSection.classList.remove("d-none")
        } catch (err) {
            console.error("Send OTP failed:", err)
            alert(err.message)
        }
    })

    resetPasswordBtn.addEventListener("click", async () => {
        const username = document.getElementById("usernameInput").value.trim()
        const otp = document.getElementById("otpInput").value.trim()
        const newPassword = document.getElementById("newPasswordInput").value.trim()
        const confirmPassword = document.getElementById("confirmPasswordInput").value.trim()

        if (!otp || !newPassword || !confirmPassword) {
            alert("Please fill in all fields")
            return
        }
        
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match")
            return
        }

        try {
            const token = await verifyOtp(username, otp)
            await updatePassword(newPassword, token)
            alert("Password updated successfully. Please log in again.")
            window.location.assign("index.html")
        } catch (err) {
            console.error("Reset password failed:", err)
            alert(err.message)
        }
    })
})
