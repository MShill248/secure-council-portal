document.addEventListener("DOMContentLoaded", async () => {
    const requestForm = document.getElementById("request-form")
    const returnBtn = document.querySelector(".btn-outline-secondary")
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

    returnBtn.addEventListener("click", () => {
        window.location.href = "requestdashboard.html"
    })
})