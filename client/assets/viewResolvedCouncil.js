document.addEventListener("DOMContentLoaded", async () => {
    const residentName = document.querySelector("#residentName")
    const residentAddress = document.querySelector("#residentAddress")
    const residentPhone = document.querySelector("#residentPhone")
    const requestDescription = document.getElementById("requestDescription")
    const priority = document.querySelector('#Priority')
    const resolved = document.getElementById("resolved")
    const returnBtn = document.querySelector("#returnBtn")
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

        const messageResponse = await fetch(`http://localhost:3000/message/request/${requestId}`, options)
        if (!messageResponse.ok) throw new Error("Failed to fetch user details")
        const message = await messageResponse.json()
        
        receiver_id = user.user_id
        residentName.value = `${user.first_name} ${user.last_name}`
        residentAddress.value = `${user.address}, ${user.postcode}` 
        residentPhone.value = user.phone_number
        requestDescription.textContent = request.description
        councilMessage.value = message[0].content
        priority.value = request.priority
        resolved.checked = request.status == "resolved" ? true : false

    } catch (error) {
        console.error("Error loading request details:", error)
        alert("Could not load request details.")
    }

    returnBtn.addEventListener("click", () => {
        window.location.href = "requestdashboard.html";
    });
    
})