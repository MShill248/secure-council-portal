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

    document.getElementById("downloadPdfBtn").addEventListener("click", () => {
        const { jsPDF } = window.jspdf
        const doc = new jsPDF({ unit: 'pt', format: 'a4' })

        const title = document.getElementById("Title").value
        const type = document.getElementById("requestType").value
        const category = document.getElementById("requestCategory").value
        const description = document.getElementById("description").value
        const message = document.getElementById("message").value
        const priority = document.getElementById("priority").value
        const status = document.getElementById("status").value

        let y = 40

        // Header
        doc.setFontSize(18)
        doc.setFont("helvetica", "bold")
        doc.text("Request Details", 40, y)
        y += 30

        doc.setFontSize(12)
        doc.setFont("helvetica", "normal")

        // Function to draw labeled box with bold label
        const drawBox = (label, value, yPos) => {
            doc.setFillColor(230, 230, 230) // light gray background
            doc.rect(40, yPos, 520, 25, "F")

            // Label
            doc.setFont("helvetica", "bold")
            doc.text(`${label}:`, 45, yPos + 17)

            // Value with padding
            doc.setFont("helvetica", "normal")
            const labelWidth = doc.getTextWidth(`${label}:`)
            doc.text(`${value}`, 45 + labelWidth + 10, yPos + 17) // +10 padding

            return yPos + 35
        }

        // Usage
        y = drawBox("Title", title, y)
        y = drawBox("Type", type, y)
        y = drawBox("Category", category, y)

        // Description box (multi-line)
        doc.setFillColor(230, 230, 230)
        doc.rect(40, y, 520, 80, "F")

        doc.setFont("helvetica", "bold")
        doc.text("Description:", 45, y + 15)

        doc.setFont("helvetica", "normal")
        doc.text(doc.splitTextToSize(description, 500), 55, y + 30) // shifted +10 for padding
        y += 100

        // Council message box
        doc.setFillColor(230, 230, 230)
        doc.rect(40, y, 520, 80, "F")

        doc.setFont("helvetica", "bold")
        doc.text("Council Message:", 45, y + 15)

        doc.setFont("helvetica", "normal")
        doc.text(doc.splitTextToSize(message, 500), 55, y + 30) // shifted +10 for padding
        y += 100

        // Priority & Status side by side
        doc.setFillColor(200, 220, 255)
        doc.rect(40, y, 250, 25, "F")
        doc.rect(310, y, 250, 25, "F")

        doc.setFont("helvetica", "bold")
        doc.text("Priority:", 45, y + 17)
        doc.text("Status:", 315, y + 17)

        doc.setFont("helvetica", "normal")
        const prWidth = doc.getTextWidth("Priority:")
        const stWidth = doc.getTextWidth("Status:")
        doc.text(priority, 45 + prWidth + 10, y + 17) // +10 padding
        doc.text(status, 315 + stWidth + 10, y + 17) // +10 padding

        // Footer
        const pageHeight = doc.internal.pageSize.height
        doc.setFontSize(10)
        doc.setFont("helvetica", "italic")
        doc.text("© 2025 Secure Council Portal. All rights reserved.", 40, pageHeight - 30)

        // Save PDF
        doc.save("request-details.pdf")
    })

    let currentUserEmail = null

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
            currentUserEmail = user.email
        } catch (err) {
            console.error("Error loading user details:", err)
        }
    }

    loadUserEmail()

    document.getElementById("emailPdfBtn").addEventListener("click", () => {
        const { jsPDF } = window.jspdf
        const doc = new jsPDF({ unit: 'pt', format: 'a4' })

        const title = document.getElementById("Title").value
        const type = document.getElementById("requestType").value
        const category = document.getElementById("requestCategory").value
        const description = document.getElementById("description").value
        const message = document.getElementById("message").value
        const priority = document.getElementById("priority").value
        const status = document.getElementById("status").value

        let y = 40

        // Header
        doc.setFontSize(18)
        doc.setFont("helvetica", "bold")
        doc.text("Request Details", 40, y)
        y += 30

        doc.setFontSize(12)
        doc.setFont("helvetica", "normal")

        // Function to draw labeled box with bold label
        const drawBox = (label, value, yPos) => {
            doc.setFillColor(230, 230, 230) // light gray background
            doc.rect(40, yPos, 520, 25, "F")

            // Label
            doc.setFont("helvetica", "bold")
            doc.text(`${label}:`, 45, yPos + 17)

            // Value with padding
            doc.setFont("helvetica", "normal")
            const labelWidth = doc.getTextWidth(`${label}:`)
            doc.text(`${value}`, 45 + labelWidth + 10, yPos + 17) // +10 padding

            return yPos + 35
        }

        // Usage
        y = drawBox("Title", title, y)
        y = drawBox("Type", type, y)
        y = drawBox("Category", category, y)

        // Description box (multi-line)
        doc.setFillColor(230, 230, 230)
        doc.rect(40, y, 520, 80, "F")

        doc.setFont("helvetica", "bold")
        doc.text("Description:", 45, y + 15)

        doc.setFont("helvetica", "normal")
        doc.text(doc.splitTextToSize(description, 500), 55, y + 30) // shifted +10 for padding
        y += 100

        // Council message box
        doc.setFillColor(230, 230, 230)
        doc.rect(40, y, 520, 80, "F")

        doc.setFont("helvetica", "bold")
        doc.text("Council Message:", 45, y + 15)

        doc.setFont("helvetica", "normal")
        doc.text(doc.splitTextToSize(message, 500), 55, y + 30) // shifted +10 for padding
        y += 100

        // Priority & Status side by side
        doc.setFillColor(200, 220, 255)
        doc.rect(40, y, 250, 25, "F")
        doc.rect(310, y, 250, 25, "F")

        doc.setFont("helvetica", "bold")
        doc.text("Priority:", 45, y + 17)
        doc.text("Status:", 315, y + 17)

        doc.setFont("helvetica", "normal")
        const prWidth = doc.getTextWidth("Priority:")
        const stWidth = doc.getTextWidth("Status:")
        doc.text(priority, 45 + prWidth + 10, y + 17) // +10 padding
        doc.text(status, 315 + stWidth + 10, y + 17) // +10 padding

        // Footer
        const pageHeight = doc.internal.pageSize.height
        doc.setFontSize(10)
        doc.setFont("helvetica", "italic")
        doc.text("© 2025 Secure Council Portal. All rights reserved.", 40, pageHeight - 30)

        const pdfBlob = doc.output("blob") // make pdf a blob (Binary Large Object)

        const formData = new FormData() // request form data
        formData.append("file", pdfBlob, "request-details.pdf")
        formData.append("email", currentUserEmail) // use loadUser() email
        
        async function sendEmailPdf() {
            try {
                if (!currentUserEmail) {
                    alert("Cannot fetch user email")
                    return
                }

                const response = await fetch("http://localhost:3000/auth/sendPdf", {
                    method: "POST",
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    },
                    body: formData
                })

                if (!response.ok) {
                    throw new Error("Failed to send PDF email")
                }

                const data = await response.json()
                alert("PDF emailed successfully!")
            } catch (err) {
                console.error("Error sending email:", err)
                alert("Failed to send email.")
            }
        }
        sendEmailPdf()
    })
})