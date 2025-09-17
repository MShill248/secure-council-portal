document.querySelector('.signup-form').addEventListener('submit', register_event)

async function register_event (e){
    
    e.preventDefault()
    const form = new FormData(e.target)
    const options = {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstname: form.get('firstName'),
            lastname: form.get('lastName'),
            email: form.get('email'),
            username: form.get('username'),
            password: form.get('password'),
            dob: form.get('dob'),
            address: form.get('address'),
            postcode: form.get('postcode'),
            borough: form.get('boroughs'),
            phone: form.get('phone'),
            role: form.get('userrole')
        })
    }
    const response = await fetch ('http://localhost:3000/auth/register', options)

    const data = await response.json()

}
