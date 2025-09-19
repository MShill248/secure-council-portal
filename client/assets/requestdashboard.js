const pendingRequests = document.querySelector('#pending-requests')
const resolvedRequests = document.querySelector('#resolved-requests')

async function getRequests() {
    let user_role
    try {
        const options = {
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token"),
            }
        }
        const response = await fetch('http://localhost:3000/user/account', options)
        const data = await response.json()
        user_role = data.user_role
    } catch {
        console.error("Error fetching user information:", error);
    }
    try{
        const options = {
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token"),
            }
        }
        if (user_role == 'resident'){
            const response = await fetch('http://localhost:3000/request/user', options)
            const data = await response.json()
            if(response.status = 200){
                data.map((i) => {
                    create_elements(i)
            })
            }
        }
        else if (user_role == 'council'){
            const response = await fetch('http://localhost:3000/request/')
            const data = await response.json()
            if(response.status = 200){
                data.map((i) => {
                    create_elements(i)
            })
        }
        }
    }
    catch (error) {
        console.error("Error fetching requests:", error);
    }
}

function create_elements(i) {
    if(i.status == 'pending'){
        const parent_div = document.createElement('div')
        parent_div.classList.add("card", "mb-3")
        parent_div.addEventListener('click', () => editRequest(i.request_id))

        const div = document.createElement('div')
        div.classList.add("card-body", "d-flex", "justify-content-between", "align-items-center")

        const request = document.createElement('div')

        const title = document.createElement('h6')
        title.classList.add('mb-1')
        title.textContent = i.title

        const smallText = document.createElement('small')
        smallText.classList.add("text-muted")
        smallText.textContent = `Ref: PND-${i.request_id}`

        const type = document.createElement('span')
        if(i.type == "service"){
            type.classList.add("badge", "bg-danger-subtle", "text-danger", "border", "border-danger")
        } else {
            type.classList.add("badge", "bg-primary-subtle", "text-primary", "border", "border-primary")
        }
        type.textContent = i.type

        request.appendChild(title)
        request.appendChild(smallText)
        div.appendChild(request)
        div.appendChild(type)
        parent_div.appendChild(div)
        pendingRequests.appendChild(parent_div)
    }
    else if(i.status == 'resolved' || i.status == 'reviewed'){
        const parent_div = document.createElement('div')
        parent_div.classList.add("card", "mb-3")
        parent_div.addEventListener('click', () => viewedRequests(i.request_id))

        const div = document.createElement('div')
        div.classList.add("card-body", "d-flex", "justify-content-between", "align-items-center")

        const request = document.createElement('div')

        const title = document.createElement('h6')
        title.classList.add('mb-1')
        title.textContent = i.title

        const smallText = document.createElement('small')
        smallText.classList.add("text-muted")
        smallText.textContent = `Ref: RSL-${i.request_id}`

        const type = document.createElement('span')
        if(i.type == "service"){
            type.classList.add("badge", "bg-danger-subtle", "text-danger", "border", "border-danger")
        } else {
            type.classList.add("badge", "bg-primary-subtle", "text-primary", "border", "border-primary")
        }
        type.style.float = "right"
        type.style.display = "inline"
        type.textContent = i.type

        const status = document.createElement('span')
        if(i.status == "resolved"){
            status.classList.add("badge", "bg-success-subtle", "text-success", "border", "border-success")
        } else {
            status.classList.add("badge", "bg-info-subtle", "text-info", "border", "border-info")
        }
        status.style.float = "right"
        status.style.display = "inline"
        status.textContent = i.status

        request.appendChild(title)
        request.appendChild(smallText)
        div.appendChild(request)
        div.appendChild(type)
        div.appendChild(status)
        parent_div.appendChild(div)
        resolvedRequests.appendChild(parent_div)

    }
}

async function editRequest(e) {
    const options = {
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token"),
        }
    }
    const response = await fetch('http://localhost:3000/user/account', options)
    const data = await response.json()
    user_role = data.user_role
    if (user_role == 'resident'){
        window.location.assign(`viewEditRequest.html?id=${e}`)
        }

    else if (user_role == 'council'){
            window.location.assign(`viewRequest.html`)
        }
 
}


function viewedRequests(e) {
    localStorage.setItem('request_id', e)
    window.location.assign("index.html")
}

getRequests()