document.addEventListener('DOMContentLoaded', async function () {
  const popupSearch = document.querySelector('.popup-search')
  const url = window.location.origin

  const res = await fetch(`${url}/song/all`, { method: 'GET' })
  const list = await res.json()
  popupSearch.innerHTML = `
    ${list.data.map(song => `
      <li class="items-songs">
        <img class="img-song" src="${song.img_thumbnail_url}" alt="${song.title_song}">
        <h3>${song.title_song}</h3>
        <div class="container-artist">
          <img class="img-artist" src="${song.img_artist}" alt="${song.name_artist}">
          <p>${song.name_artist}</p>
        </div>
        <button class="submit-song" data-id="${song.id_api}">get lyrics</button>
      </li>
    `).join('')}
  `
})
