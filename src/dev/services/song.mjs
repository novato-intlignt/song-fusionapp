import axios from 'axios'
import dotenv from 'dotenv'
import { songData, songLyrics, lyricTranslate } from '../schemes/song-scheme.mjs'
dotenv.config()

export class SongService {
  static async search ({ input }) {
    try {
      const { song, artist } = input
      const apiKey = process.env.GENIUS_API_KEY
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
      const data = await songData(songId)
      const lyrics = await songLyrics(songId)
      const translated = await lyricTranslate(lyrics)

      if (data.length === 0) {
        return 1
      }
      if (lyrics.length === 0) {
        return 2
      }
      if (translated.length === 0) {
        return 3
      }
      const getUrl = data.media.find(obj => obj.provider === 'youtube')
      const songUrl = getUrl ? getUrl.url : null

      const song = {
        id: data.id,
        title: data.title,
        fullTitle: data.full_title,
        artist: data.artist_names,
        imgArtist: data.primary_artist.image_url,
        imgUrl: data.song_art_image_url,
        imgThumbnailUrl: data.song_art_image_thumbnail_url,
        videoUrl: songUrl,
        engLyrics: lyrics,
        espLyrics: translated
      }
      return song
    } catch (err) {
      console.log('Error: ', err)
      throw err
    }
  }
}
