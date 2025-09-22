document.addEventListener("DOMContentLoaded", async () => {
    const residentName = document.querySelector("#residentName")
    const residentAddress = document.querySelector("#residentAddress")
    const residentPhone = document.querySelector("#residentPhone")
    const requestDescription = document.getElementById("requestDescription")
    const priority = document.querySelector('#Priority')
    const resolved = document.getElementById("resolved")
    const submitBtn = document.querySelector("#submitBtn")
    const formInputs = document.querySelectorAll("input, select, textarea")
    const councilMessage = document.getElementById("councilMessage")
    const params = new URLSearchParams(window.location.search)
    const requestId = params.get("id")

    let receiver_id

    try {
        const options = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        };
        const response = await fetch(`http://localhost:3000/request/${requestId}`, options)
        if (!response.ok) throw new Error("Failed to fetch request details")
        const request = await response.json()

        const newResponse = await fetch(`http://localhost:3000/user/${request.user_id}`, options)
        if (!newResponse.ok) throw new Error("Failed to fetch user details")
        const user = await newResponse.json()
        
        receiver_id = user.user_id
        residentName.value = `${user.first_name} ${user.last_name}`
        residentAddress.value = `${user.address}, ${user.postcode}` 
        residentPhone.value = user.phone_number
        requestDescription.textContent = request.description

        const messageResponse = await fetch(`http://localhost:3000/message/request/${requestId}`, options)
        console.log(messageResponse);
        if (messageResponse.ok) {
            const messageData = await messageResponse.json()
            console.log(messageData);
            councilMessage.value = messageData[0].content || ""
        } else {
            console.error("Failed to fetch council message:", messageResponse.statusText)
        }

    } catch (error) {
        console.error("Error loading request details:", error)
        alert("Could not load request details.")
    }

    let isEditing = false
    submitBtn.addEventListener("click", async (e) => {
        e.preventDefault()
            const options = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
            };
            const senderResponse = await fetch(`http://localhost:3000/user/account`, options)
            if (!senderResponse.ok) throw new Error("Failed to fetch user details")
            const sender = await senderResponse.json()

            const updatedMessage = {
            request_id: params.get("id"),
            sender_id: sender.user_id,
            receiver_id: receiver_id,
            content: councilMessage.value
            };
            console.log(resolved);
            console.log(priority.value)
            const updatedRequest = {
            priority: priority.value,
            status: resolved.checked ? "resolved": "reviewed"
            };
            try {
                const postOptions = {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("token")
                    },
                    body: JSON.stringify(updatedMessage)
                }
                const postResponse = await fetch(`http://localhost:3000/message/`, postOptions)
                if (!postResponse.ok) throw new Error("Failed to update request")
                
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

                alert("Message sent successfully")
            } catch (err) {
                console.error("Error saving request:", err)
                alert("Failed to save request. Please try again.")
            }
        })
    })