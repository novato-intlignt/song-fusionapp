const listSongs = document.getElementById('list-songs')
const explorerForm = document.getElementById('form-explorer')
explorerForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const data = Object.fromEntries(
    new FormData(e.target)
  )
  console.log(data)
  const url = window.location.origin // Domain

  // Values of form
  const artistValue = data.artistNet
  const songValue = data.songNet

  const res = await fetch(`${url}/song/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      urlhost: url,
      song: songValue,
      artist: artistValue
    })
  })

  const result = await res.json()
  const dataSong = result.data
  if (!res.ok) {
    return Swal.fire({
      icon: result.status,
      title: result.message
    })
  }
  console.log(dataSong)
  listSongs.innerHTML = `
      ${dataSong.map(song => `
        <li class="items-songs">
          <img class="img-song" src="${song.result.song_art_image_thumbnail_url}" alt="${song.result.title}">
          <h3>${song.result.title}</h3>
          <div class="container-artist">
            <img class="img-artist" src="${song.result.primary_artist.image_url}" alt="james blunt">
            <p>${song.result.primary_artist.name}</p>
          </div>
          <button class="submit-song" data-id="${song.result.id}">get lyrics</button>
        </li>
      `)
      .join('')}
`
  console.log(dataSong)
})
