import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export class SongService {
  static async search ({ input }) {
    try {
      const { song, artist } = input
      const apiKey = process.env.API_KEY_GENIUS
      const apiUrl = `https://api.genius.com/search?q=${encodeURIComponent(`${artist} ${song}`)}&access_token=${apiKey}`

      const res = await axios.get(apiUrl)
      const searchResults = res.data.response.hits

      if (searchResults.length === 0) {
        return false
      }
      return searchResults
    } catch (err) {
      console.log('Error: ', err)
      throw err
    }
  }

  static async data ({ input }) {
    try {
      const songId = input
      const apiKey = process.env.API_KEY_GENIUS
      const apiUrl = `https://api.genius.com/songs/${songId}?access_token=${apiKey}`

      const res = await axios.get(apiUrl)
      const searchResults = res.data.response
      console.log(searchResults)

      if (searchResults.length === 0) {
        return false
      }
    } catch (err) {

    }
  }
}
