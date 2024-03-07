import { validateSong } from '../schemes/song-scheme.mjs'
export class SongController {
  constructor ({ songModel, songService }) {
    this.songService = songService
    this.songModel = songModel
  }

  search = async (req, res) => {
    try {
      const songValidate = validateSong(req.body)
      if (songValidate.success) {
        const searchSong = await this.songModel.search({ input: songValidate.data })
        if (searchSong.status === 'not_found' || searchSong.status === 'next') {
          const getSong = await this.songService.search({ input: songValidate.data })
          if (getSong === false) {
            return res.send({ status: 'error', message: 'There is some problem, please contact with the support' })
          }
          return res.status(200).json({ success: true, data: getSong })
        }
        return res.status(300).json({ status: 'warning', message: `We've got a song like ${searchSong.fullTitle}, you can find it in the search icon` })
      }
    } catch (err) {
      console.log('Error:', err)
      res.status(500).send({ status: 'error', message: 'Error internal server' })
    }
  }

  lyric = async (req, res) => {
    try {
      if (!req.params.id) return res.status(500).send({ status: 'error', message: 'Error internal server' })
      // Define the properties
      const songId = req.params.id
      const name = req.body.user
      const songData = { user: name }

      const getData = await this.songService.data({ input: songId })
      if (!getData) {
        return res.status(404).json({ status: 'error', message: 'Song data not found' })
      }
      Object.assign(songData, getData)

      const createSong = await this.songModel.create({ input: songData })
      if (createSong === '/') {
        return res.status()
      }
      if (createSong.status === 'success') {
        return res.status(200).json({ status: 'success', message: `The song ${getData.fullTitle} was registered successfully` })
      } else {
        return res.status(400).json({ status: 'error', message: "There is some problem registering the song, please contact to LyricsFusion's support" })
      }
    } catch (err) {
      console.log('Error:', err)
      return res.status(500).send({ status: 'error', message: 'Error internal server' })
    }
  }

  getByUser = async (req, res) => {
    try {
      const name = req.body.user
      const viewSong = await this.songModel.getByUser({ input: name })
      if (viewSong.status === 'empty') {
        return res.status(300).json({ status: 'warning', message: "You don't have songs on your record yet" })
      }
      return res.status(200).json({ success: true, data: viewSong })
    } catch (err) {
      console.log('Error:', err)
      return res.status(500).send({ status: 'error', message: 'Error internal server' })
    }
  }

  delete = async (req, res) => {
    try {
      if (!req.params.id) return res.status(500).send({ status: 'error', message: 'Error internal server' })

      const songId = req.carams.id
      const user = req.body.user
      const data = { id: songId, name: user }

      const deleteSong = await this.songModel.delete({ incut: data })

      if (deleteSong.status === 'success') {
        return res.status(200).json({ status: 'success', message: `The song ${deleteSong.title} was deleted of your library successfully` })
      } else if (deleteSong.status === 'warning') {
        return res.status(400).json({ status: 'warning', message: `We couldn't delete the song ${deleteSong.title} of your library` })
      }
    } catch (err) {
      console.log('Error:', err)
      return res.status(500).send({ status: 'error', message: 'Error internal server' })
    }
  }

  getAll = async (req, res) => {
    try {
      const songList = await this.songModel.getAll()

      return res.status(200).json({ success: true, data: songList })
    } catch (err) {
      console.log('Error:', err)
      return res.status(500).send({ status: 'error', message: 'Error internal server' })
    }
  }
}
