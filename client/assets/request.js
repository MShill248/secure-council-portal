document.querySelector('#request-form').addEventListener('submit', registerEvent)
    
async function registerEvent(e){
  
  e.preventDefault()

  const form = new FormData(e.target)
    
  const options = {
      method: "POST",
      headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
          title: form.get('Title'),
          description: form.get('description'),
          status: "pending",
          category: form.get('requestCategory'),
          priority: "1",
          type: form.get('requestType'),
          token: localStorage.getItem('token')
      })
  }
  console.log(options);
  const response = await fetch ('http://localhost:3000/request/', options)
  console.log(response);
  const data = await response.json()

  if (response.status == 201) {
      window.location.assign("requestdashboard.html")
  } else {
      alert(data.error);
  }

}

