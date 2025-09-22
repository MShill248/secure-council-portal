/* document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("userid");
  const token = localStorage.getItem("token");

  if (!userId || !token) {
    window.location.href = "index.html";
    return;
  }
}) */
const logout = document.querySelector('#logout')
logout.addEventListener('click', () => {
  localStorage.removeItem('token')
  window.location.assign('index.html')
})