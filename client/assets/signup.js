document.querySelector('.signup-form').addEventListener('submit', registerEvent)
    
async function registerEvent(e){
  
  e.preventDefault()

  const form = new FormData(e.target)
    
  const options = {
      method: "POST",
      headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          first_name: form.get('firstName'),
          last_name: form.get('lastName'),
          email: form.get('email'),
          username: form.get('username'),
          password: form.get('password'),
          dob: form.get('dob'),
          address: form.get('address'),
          postcode: form.get('postcode'),
          borough: form.get('boroughs'),
          phone_number: form.get('phone'),
          user_role: form.get('userrole')
      })
  }
    
  const response = await fetch ('http://localhost:3000/auth/register', options)
  const data = await response.json()

  if (response.status == 201) {
      window.location.assign("index.html")
  } else {
      alert(data.error);
  }

}

