import { validateSong } from '../schemes/song-scheme.mjs'
export class SongController {
  constructor ({ songService }) {
    this.songService = songService
  }

  search = async (req, res) => {
    try {
      const songValidate = validateSong(req.body)
      if (songValidate.success) {
        const getSong = await this.songService.search({ input: songValidate.data })
        if (getSong === false) {
          return res.send({ status: 'error', message: 'There is some problem, please contact with the support' })
        }
        console.log(getSong)
        return res.status(200).json({ success: true, data: getSong })
      }
    } catch (err) {
      console.log('Error:', err)
      res.status(500).send({ status: 'error', message: 'Error internal server' })
    }
  }
}
