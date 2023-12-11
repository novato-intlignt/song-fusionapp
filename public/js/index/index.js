const loginContainer = document.getElementById('loginContainer')
fetch('/public/login.html')
  .then(response => response.text())
  .then(data => {
    loginContainer.innerHTML = data
  })
document.getElementById('startBtn').addEventListener('click', function () {
  const header = document.querySelector('header')
  const footer = document.querySelector('footer')

  // Add classes fot slide animations
  header.classList.add('slide-up')
  footer.classList.add('slide-down')

  setTimeout(function () {
    // Show the login page
    loginContainer.style.editor = 'block'
    header.style.editor = 'none'
    footer.style.editor = 'none'
  }, 500) // Adjust the duration based on your CSS animation time
})
