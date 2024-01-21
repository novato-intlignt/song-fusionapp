document.addEventListener('DOMContentLoaded', async function () {
  const userGallery = document.getElementById('user-gallery')

  const url = window.location.origin

  const res = await fetch(`${url}/song`, {
    method: 'GET'
  })

  const result = await res.json()
  const songData = result.data
  if (!res.ok) {
    return Swal.fire({
      icon: result.status,
      title: result.message
    })
  }

  userGallery.innerHTML = `
      ${songData.map(song => `
        <li class="song-card">
          <img src="${song.img_thumbnail_url}" alt="Song Image" class="song-img">
          <div class="song-details">
            <h3 class="song-title">${song.title_song}</h3>
            <div class="artist-info">
              <img src="${song.img_artist}" alt="Artist Image" class="artist-img" style="width: 25px; height: 25px; border-radius: 50%;">
              <span class="artist-name">${song.name_artist}</span>
            </div>
          </div>
          <button class="btn-song" song-id="${song.id_api}">view</button>
        </li>
      `)
      .join('')}
`
})
