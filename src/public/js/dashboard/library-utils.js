document.addEventListener('DOMContentLoaded', function () {
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
        noPage: 0,
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
      console.log(noItemsPerPage)

      this.makeGallery(noItemsPerPage)
    }

    makeGallery (entries) {
      this.conpyitems = [...this.items]

      this.initPagination(this.items.length, entries)

      this.renderLi()
      this.renderPages()
      this.renderSearch()
    }

    initPagination (total, entries) {
      this.pagination.total = total
      this.pagination.noItemsPerPage = entries
      this.pagination.noPage = Math.ceil(this.pagination.total / this.pagination.noItemsPerPage)
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

    }
  }
  const selector = document.querySelector('#user-gallery')
  const dg = new DataGallery(selector)
  dg.parse()
})
