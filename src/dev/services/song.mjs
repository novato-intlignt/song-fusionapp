import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export class SongService {
  static async search ({ input }) {
    const { song, artist } = input
    console.log(song, artist)
  }
}
