class DataSearchSong {
  object
  items
  popup
  copyItems
  numberOfItems

  constructor (selector) {
    this.object = selector

    this.items = []
    this.copyItems = []
    this.numberOfItems = 7
  }

  parse () {
    for (let i = 0; i < this.object.length; i++) {
      const obj = this.object[i]
      const item = {
        id: this.getRandomUUID(),
        values: []
      }
      item.values.push(obj)
      this.items.push(item)
    }
    console.log(this.items)
    this.makeList()
  }

  makeList () {
    this.copyItems = [...this.items]
    this.popup = document.querySelector('.popup-search')

    this.renderSearch()
  }

  renderPopup () {
    this.popup.innerHTML = ''
    let data = ''

    for (let i = 0; i < this.copyItems.length; i++) {
      const { values } = this.copyItems[i]
      values.forEach(item => {
        data += `
        <li class="items-songs">
          <img class="img-song" src="${item.img_thumbnail_url}" alt="${item.title_song}">
          <h3>${item.title_song}</h3>
          <div class="container-artist">
            <img class="img-artist" src="${item.img_artist}" alt="${item.name_artist}">
            <p>${item.name_artist}</p>
          </div>
          <button class="submit-song" data-id="${item.id_api}">get lyrics</button>
        </li>
      `
      })
    }

    this.popup.innerHTML = `${data}`

    this.changeStyle()
  }

  renderSearch () {
    const fields = document.querySelectorAll('.sidebar-input')
    const artistField = document.querySelector('#artist')
    const songField = document.querySelector('#songs')

    fields.forEach(field => {
      field.addEventListener('input', e => {
        const artistValue = artistField.value.trim().toLowerCase()
        const songValue = songField.value.trim().toLowerCase()

        if (artistValue && songValue) {
          const artistList = this.search({ obj: { id: artistField.id, value: artistValue } })
          const songsList = this.search({ obj: { id: songField.id, value: songValue } })
          const res = []

          songsList.forEach(song => {
            artistList.forEach(artist => {
              if (song.id === artist.id) {
                res.push(song)
              }
            })
          })

          this.copyItems = [...res]
        } else if (artistValue || songValue) {
          const searchTerm = artistValue || songValue
          const fieldId = artistValue ? artistField.id : songValue ? songField.id : ''
          const itemList = this.search({ obj: { id: fieldId, value: searchTerm } })

          this.copyItems = [...itemList]
        }
        if (artistValue === '' && songValue === '') {
          this.copyItems = []
        }
        this.renderPopup()
      })
    })
  }

  search ({ obj }) {
    const res = []
    this.copyItems = [...this.items]
    const { id, value } = obj
    const property = (id === 'artist') ? 'name_artist' : 'title_song'
    for (let i = 0; i < this.copyItems.length; i++) {
      const { values } = this.copyItems[i]

      for (let j = 0; j < values.length; j++) {
        const data = values[j]

        if (data[property].toLowerCase().indexOf(value) >= 0) {
          res.push(this.copyItems[i])
          break
        }
      }
    }
    return res
  }

  changeStyle () {
    const container = document.querySelector('.container-popup')
    const count = ((this.copyItems.length - 1) * 80) + 86

    if (this.copyItems.length > 0) {
      this.popup.style.height = count + 'px'
      container.classList.add('open')
    } else {
      container.classList.remove('open')
    }
  }

  getRandomUUID () {
    return crypto.randomUUID()
  }
}
document.addEventListener('DOMContentLoaded', async function () {
  const url = window.location.origin

  const res = await fetch(`${url}/song/all`, { method: 'GET' })
  const list = await res.json()
  const dl = new DataSearchSong(list.data)
  dl.parse()
})
