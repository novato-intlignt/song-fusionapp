const sidebar = document.querySelector('.sidebar')
const closeBtn = document.querySelector('#btn')
const searchBtn = document.querySelector('.fi-rr-search')

closeBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open')
  menuBtnChange()// calling the function(optional)
})

searchBtn.addEventListener('click', () => { // Sidebar open when you click on the search iocn
  sidebar.classList.toggle('open')
  menuBtnChange() // calling the function(optional)
})

// following are the code to change sidebar button(optional)
function menuBtnChange () {
  if (sidebar.classList.contains('open')) {
    closeBtn.classList.replace('fi-rr-menu-burger', 'fi-rr-bars-staggered')// replacing the iocns class
  } else {
    closeBtn.classList.replace('fi-rr-bars-staggered', 'fi-rr-menu-burger')// replacing the iocns class
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const path = window.location.pathname
  const parts = path.split('/')
  const userName = parts[2]
  console.log(userName)

  // Set the userName in the html
  const nameHtml = document.getElementById('user')
  if (userName) {
    nameHtml.innerText = userName
  }
})
