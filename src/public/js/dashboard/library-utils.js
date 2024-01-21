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

    list.forEach(list => {
      const songDetails = [...list.children]

      const idApiElement = [...list.children][2]
      const idApi = idApiElement.getAttribute('song-id')
      const imgElement = [...list.children][0]
      const img = imgElement.getAttribute('src')

      const item = {
        id: this.generateUUID(),
        values: {}
      }
      item.values.id_api = idApi
      item.values.img_thumbnail_url = img

      songDetails.forEach(songDetails => {
        if (songDetails.children.length > 0) {
          const artistInfo = [...songDetails.children]
          const songTitleElement = [...songDetails.children][0]
          const songTitle = songTitleElement.textContent

          item.values.title_song = songTitle

          artistInfo.forEach(artistInfo => {
            if (artistInfo.children.length > 0) {
              const artistImgElement = [...artistInfo.children][0]
              const artistImg = artistImgElement.getAttribute('src')
              const artistNameElement = [...artistInfo.children][1]
              const artistName = artistNameElement.textContent
              item.values.name_artist = artistName
              item.values.img_artist = artistImg
            }
          })
        }
      })
      this.items.push(item)
    })

    const noItemsPerPage = this.itemsPerPage(list)
    console.log(this.items)
    console.log(this.element)
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
          <li id="${song.id}" class="song-card">
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
            <button class="btn-song" song-id="${song.values.id_api}">view</button>
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
  console.log('hello')
})
