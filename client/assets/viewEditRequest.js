const logout = document.querySelector('#logout')
document.addEventListener("DOMContentLoaded", async () => {
    const requestForm = document.getElementById("request-form")
    const editBtn = document.querySelector(".btn-success")
    const returnBtn = document.querySelector(".btn-outline-secondary")
    const formInputs = requestForm.querySelectorAll("input, select, textarea")
    const councilMessage = document.getElementById("message")
    const params = new URLSearchParams(window.location.search)
    const requestId = params.get("id")

    try {
        const options = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        }
        const response = await fetch(`http://localhost:3000/request/${requestId}`, options)
        if (!response.ok) throw new Error("Failed to fetch request details")
        const request = await response.json()

        document.getElementById("Title").value = request.title
        document.getElementById("description").value = request.description
        document.getElementById("requestType").value = request.type
        document.getElementById("requestCategory").value = request.category

        const messageResponse = await fetch(`http://localhost:3000/message/request/${requestId}`, options)
        if (messageResponse.ok) {
            const messageData = await messageResponse.json()
            councilMessage.value = messageData.message || ""
        } else {
            console.error("Failed to fetch council message:", messageResponse.statusText)
        }
        councilMessage.readOnly = true

        formInputs.forEach(input => {
            if (input !== councilMessage) {
                input.readOnly = true
                if (input.tagName === "SELECT" || input.tagName === "TEXTAREA") input.disabled = true
            }
        })

    } catch (error) {
        console.error("Error loading request details:", error)
        alert("Could not load request details.")
    }

    let isEditing = false
    editBtn.addEventListener("click", async () => {
        if (!isEditing) {
            formInputs.forEach(input => {
                if (input !== councilMessage) {
                    input.readOnly = false
                    if (input.tagName === "SELECT" || input.tagName === "TEXTAREA") input.disabled = false
                }
            })
            editBtn.textContent = "Save Changes"
            editBtn.classList.replace("btn-success", "btn-primary")
            isEditing = true
        } else {
            const updatedRequest = {
                title: document.getElementById("Title").value,
                description: document.getElementById("description").value,
                type: document.getElementById("requestType").value,
                category: document.getElementById("requestCategory").value
            }

            try {
                const patchOptions = {
                    method: "PATCH",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("token")
                    },
                    body: JSON.stringify(updatedRequest)
                }
                const patchResponse = await fetch(`http://localhost:3000/request/${requestId}`, patchOptions)
                if (!patchResponse.ok) throw new Error("Failed to update request")

                formInputs.forEach(input => {
                    input.readOnly = true
                    if (input.tagName === "SELECT" || input.tagName === "TEXTAREA") input.disabled = true
                })

                editBtn.textContent = "Edit Request"
                editBtn.classList.replace("btn-primary", "btn-success")
                isEditing = false

                alert("Request updated successfully")
            } catch (err) {
                console.error("Error saving request:", err)
                alert("Failed to save request. Please try again.")
            }
        }
    
    
    })

    returnBtn.addEventListener("click", () => {
<<<<<<< HEAD
        window.location.href = "requestdashboard.html"
    })
=======
        window.location.href = "requestdashboard.html";
    });
})

logout.addEventListener('click', () => {
    localStorage.removeItem('token')
    window.location.assign('index.html')
>>>>>>> 1a05eef (add logout functionality to all pages)
})