class DataGallery {
  element
  items
  conpyitems
  selected
  pagination

  constructor (selector) {
    this.element = selector

    this.items = []
    this.pagination = {
      total: 0,
      noItemsPerPage: 0,
      noPages: 0,
      current: 0,
      pointer: 0,
      diff: 0,
      lastPageBeforeDots: 0,
      noButtonsBeforeDots: 0
    }
    this.selected = []
  }

  async parse () {
    await this.waitForElement()
    const list = [...this.element.children]
    console.log(list)
    list.forEach(list => {
      const idApi = list.getAttribute('song-id')
      const imgElement = [...list.children][0]
      const img = imgElement.getAttribute('src')
      const titleElement = [...list.children][1]
      const title = titleElement.textContent
      const imgArtistElement = [...list.children][2]
      const imgArtist = imgArtistElement.getAttribute('src')
      const artistNameElement = [...list.children][3]
      const artistName = artistNameElement.textContent

      const item = {
        id: this.generateUUID(),
        values: {}
      }
      item.values.id_api = idApi
      item.values.title_song = title
      item.values.img_thumbnail_url = img
      item.values.name_artist = artistName
      item.values.img_artist = imgArtist

      this.items.push(item)
    })

    const noItemsPerPage = this.itemsPerPage(list)
    console.log(this.items)
    console.log(noItemsPerPage)

    this.makeGallery(noItemsPerPage)
  }

  makeGallery (entries) {
    this.conpyitems = [...this.items]

    this.initPagination(this.items.length, entries)

    const container = document.createElement('ul')
    container.id = this.element.id
    container.className = this.element.className
    this.element.innerHTML = ''
    this.element.replaceWith(container)
    this.element = container

    this.renderLi()
    this.renderButtons()
    this.renderPages()
    this.renderSearch()
    this.hearSong()
  }

  initPagination (total, entries) {
    this.pagination.total = total
    this.pagination.noItemsPerPage = entries
    this.pagination.noPages = Math.ceil(this.pagination.total / this.pagination.noItemsPerPage)
    this.pagination.current = 1
    this.pagination.pointer = 0
    this.pagination.diff = this.pagination.noItemsPerPage - (this.pagination.total % this.pagination.noItemsPerPage)
  }

  generateUUID () {
    return crypto.randomUUID()
  }

  waitForElement () {
    return new Promise((resolve) => {
      const checkElement = () => {
        if (this.element && this.element.children.length > 0) {
          resolve()
        } else {
          setTimeout(checkElement, 100)
        }
      }

      checkElement()
    })
  }

  itemsPerPage (element) {
    const sampleElement = element[0]
    const sampleElementWidth = sampleElement.offsetWidth
    const sampleElementHeight = sampleElement.offsetHeight

    const gallery = document.querySelector('.gallery')
    const windowWidth = gallery.clientWidth
    const itemsPerRow = Math.floor(windowWidth / sampleElementWidth)
    const itemsPerPage = Math.floor(window.innerHeight / sampleElementHeight) * itemsPerRow
    return itemsPerPage
  }

  renderLi () {
    let i = 0
    const { pointer, total } = this.pagination
    const limit = this.pagination.current * this.pagination.noItemsPerPage

    for (i = pointer; i < limit; i++) {
      if (i === total) break
      const { id, values } = this.conpyitems[i]
      this.element.innerHTML = `
        ${this.items.map(song => `
          <li song-id="${song.values.id_api}" class="song-card">
            <div class="checkbox-container"><input type="checkbox"></div>
            <div class="menu-opt">
                <button class="btn-tool" song-id="${song.values.id_api}"><i class="fi fi-rr-trash"></i></button>
            </div>
            <button class="btn-opt" ><i class="fi fi-br-menu-dots-vertical"></i></button>
            <img src="${song.values.img_thumbnail_url}" alt="Song Image" class="song-img">
            <div class="song-details">
              <h3 class="song-title">${song.values.title_song}</h3>
              <div class="artist-info">
                <img src="${song.values.img_artist}" alt="Artist Image" class="artist-img" style="width: 25px; height: 25px; border-radius: 50%;">
                <span class="artist-name">${song.values.name_artist}</span>
              </div>
            </div>
            <button song-id="${song.values.id_api}" class="btn-song">view</button>
          </li>
        `).join('')}
      `
    }
  }

  renderPages () {
    const pageUl = document.querySelector('.page-list')
    const page = ''

    const buttonsToShow = this.pagination.noButtonsBeforeDots
    const currentIndex = this.pagination.current

    const limI = Math.max(currentIndex - 2, 1)
    const limS = Math.min(currentIndex + 2, this.pagination.noPages)
  }

  renderSearch () {

  }

  renderButtons () {
    const btnOptList = this.element.querySelectorAll('.btn-opt')
    const btnSelect = document.querySelector('.select-btn')
    const btnCancel = document.querySelector('#cancel-btn')
    const allSelectBtn = this.element.querySelectorAll('.checkbox-container')
    const containerActions = document.querySelector('.actions-container')

    btnOptList.forEach(btnOpt => {
      btnOpt.addEventListener('click', () => {
        const allMenuList = this.element.querySelectorAll('.menu-opt')

        allMenuList.forEach(menuOpt => {
          if (menuOpt.classList.contains('open') && menuOpt !== btnOpt.previousElementSibling) {
            menuOpt.classList.remove('open')
          }
        })

        const menuOpt = btnOpt.previousElementSibling

        if (!menuOpt.classList.contains('open')) {
          menuOpt.classList.add('open')
        } else {
          menuOpt.classList.remove('open')
        }
      })
    })

    btnSelect.addEventListener('click', () => {
      allSelectBtn.forEach(selectBtn => {
        selectBtn.classList.add('open')
      })
      containerActions.classList.add('open')
    })
    btnCancel.addEventListener('click', () => {
      allSelectBtn.forEach(selectBtn => {
        selectBtn.classList.remove('open')
      })
      containerActions.classList.remove('open')
    })
  }

  hearSong () {
    const btnSongList = [...this.element.querySelectorAll('.btn-song')]

    btnSongList.forEach(btnSong => {
      btnSong.addEventListener('click', () => {
        console.log(btnSong)
        const audioPlayer = btnSong.nextElementSibling
        const videoUrl = btnSong.getAttribute('song-url')

        // Utiliza la API de YouTube para obtener la URL del recurso de audio
        this.getYouTubeAudioUrl(videoUrl)
          .then(audioUrl => {
            console.log(audioUrl)
            // Cambia la fuente del reproductor de audio HTML5
            audioPlayer.src = audioUrl
            audioPlayer.play()
            console.log(audioPlayer)
          })
          .catch(error => {
            console.error('Error al obtener la URL del audio:', error)
          })

        // Cambia los botones de reproducción
        this.changeSongBtn(btnSong)
      })
    })
  }

  changeSongBtn (currentBtn) {
    const allBtn = [...this.element.querySelectorAll('.btn-song')]
    allBtn.forEach(btn => {
      if (allBtn !== currentBtn) {
        btn.innerHTML = '<i class="fi fi-sr-pause-circle"></i>'
      }
    })
  }

  getYouTubeAudioUrl (videoUrl) {
    return new Promise((resolve, reject) => {
      const videoId = this.getYouTubeVideoId(videoUrl)
      if (videoId) {
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=AIzaSyANuFqKxmwHfHnVfQoIV2ca0rek3DYFeNM`

        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            const duration = data.items[0].contentDetails.duration
            const audioUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&amp;loop=1&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fravenseries.lat&amp;widgetid=1`
            resolve(audioUrl)
          })
          .catch(error => {
            reject(error)
          })
      } else {
        reject('URL de video de YouTube no válida')
      }
    })
  }

  // Método para obtener el ID del video de YouTube desde la URL
  getYouTubeVideoId (url) {
    const match = url.match(/[?&]v=([^&]*)/)
    return match && match[1]
  }
}
document.addEventListener('DOMContentLoaded', function () {
  const selector = document.querySelector('#user-gallery')
  const dg = new DataGallery(selector)
  dg.parse()
})
const btnLibrarySection = document.getElementById('btn-library')
btnLibrarySection.addEventListener('DOMContentLoaded', function () {
  const selector = document.querySelector('#user-gallery')
  const dg = new DataGallery(selector)
  dg.parse()
})
