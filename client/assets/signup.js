// document.querySelector('.signup-form').addEventListener('submit', register_event)

// async function register_event (e){
    
//     e.preventDefault()
//     const form = new FormData(e.target)
//     const options = {
//         method: "POST",
//         headers: {
//             "Accept": "application/json",
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             firstname: form.get('firstName'),
//             lastname: form.get('lastName'),
//             email: form.get('email'),
//             username: form.get('username'),
//             password: form.get('password'),
//             dob: form.get('dob'),
//             address: form.get('address'),
//             postcode: form.get('postcode'),
//             borough: form.get('boroughs'),
//             phone: form.get('phone'),
//             role: form.get('userrole')
//         })
//     }
//     const response = await fetch ('http://localhost:3000/auth/register', options)

//     const data = await response.json()

// }

// client/assets/signup.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form'); // one form across both columns
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fd = new FormData(form);

    // Map frontend names -> backend snake_case fields
    const payload = {
      username:     fd.get('username'),
      first_name:   fd.get('firstName'),
      last_name:    fd.get('lastName'),
      email:        fd.get('email'),
      password:     fd.get('password'),
      dob:          fd.get('dob'),
      address:      fd.get('address'),
      postcode:     fd.get('postcode'),
      borough:      fd.get('boroughs'),
      phone_number: fd.get('phone'),
      user_role:    fd.get('userrole')
    };

    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const msg = await res.text();
        alert(`Sign up failed: ${res.status} ${msg}`);
        return;
      }

      alert('Account created! Please sign in.');
      window.location.href = 'index.html';
    } catch (err) {
      console.error(err);
      alert(`Network error: ${err.message}`);
    }
  });
});
