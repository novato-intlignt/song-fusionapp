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
        const getSong = await this.songService.search({ input: songValidate.data })
        if (getSong === false) {
          return res.send({ status: 'error', message: 'There is some problem, please contact with the support' })
        }
        return res.status(200).json({ success: true, data: getSong })
      }
    } catch (err) {
      console.log('Error:', err)
      res.status(500).send({ status: 'error', message: 'Error internal server' })
    }
  }

  lyric = async (req, res) => {
    try {
      if (!req.params.id) return res.status(500).send({ status: 'error', message: 'Error internal server' })

      const songId = req.params.id
      const name = req.body.user
      const songData = { user: name }
      const getData = await this.songService.data({ input: songId })
      Object.assign(songData, getData)
      const createSong = await this.songModel.create({ input: songData })
    } catch (err) {
      console.log('Error:', err)
      res.status(500).send({ status: 'error', message: 'Error internal server' })
    }
  }
}
