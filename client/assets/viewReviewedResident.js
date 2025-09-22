document.addEventListener("DOMContentLoaded", async () => {
    const requestForm = document.getElementById("request-form")
    const returnBtn = document.querySelector(".btn-outline-secondary")
    const councilMessage = document.getElementById("message")
    const priority = document.getElementById("priority")
    const status = document.getElementById("status") 
    const params = new URLSearchParams(window.location.search)
    const requestId = params.get("id")

    priorityMap = {
        1: "Low",
        2: "Medium",
        3: "High"
    }

    const statusMap = {
        pending: "Pending",
        reviewed: "Reviewed",
        resolved: "Resolved"
    }

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
        priority.value = priorityMap[request.priority] || "Not set"
        status.value = statusMap[request.status] || "Pending"

        const messageResponse = await fetch(`http://localhost:3000/message/request/${requestId}`, options)
        
        if (messageResponse.ok) {
            const messageData = await messageResponse.json()
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