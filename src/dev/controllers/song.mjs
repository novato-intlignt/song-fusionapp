export class SongController {
  constructor ({ songService }) {
    this.songService = songService
  }

  search = async (req, res) => {
    console.log('holi')
  }
}
