document.addEventListener('DOMContentLoaded', async function () {
  const btnLibrary = document.getElementById('btn-library')
  const userGallery = document.getElementById('user-gallery')
  let res

  const url = window.location.origin

  res = await fetch(`${url}/song`, {
    method: 'GET'
  })

  btnLibrary.addEventListener('click', async function () {
    const url = window.location.origin
    console.log('holi')
    res = await fetch(`${url}/song`, {
      method: 'GET'
    })
  })
})
