const explorerForm = document.getElementById('form-explorer')
explorerForm.addEventListener('submit', async (e) => {
  const data = Object.entries(
    new FormData(e.target)
  )
  console.log('holi')
  const url = window.location.origin // Domain

  // Values of form
  const artistValue = data.artistNet
  const songValue = data.songNet

  const res = await fetch(`${url}/song/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'aplication/json'
    },
    body: {
      song: songValue,
      artist: artistValue
    }
  })
})
