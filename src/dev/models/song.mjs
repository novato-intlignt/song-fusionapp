import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
}
const connection = await mysql.createConnection(config)

export class SongModel {
  static async create ({ input }) {
    const {
      user,
      id,
      title,
      fullTitle,
      artist,
      imgArtist,
      imgUrl,
      imgThumbnailUrl,
      videoUrl,
      engLyrics,
      espLyrics
    } = input

    try {
      const [userData] = await connection.execute('SELECT id_user FROM users WHERE name = ?', [user])
      const userId = userData[0].id_user.toString('hex')

      const newArtist = await connection.execute(
        'INSERT INTO artists (name_artist, img_artist) VALUES (?, ?)', [artist, imgArtist]
      )
      const [artistData] = await connection.execute('SELECT id_artist FROM artists WHERE name_artist = ?', [artist])
      const artistId = artistData[0].id_artist

      const newSong = await connection.execute('INSERT INTO songs (id_api, title_song, full_title, img_url, img_thumbnail_url, video_song, eng_lyrics, esp_lyrics, id_artist) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, title, fullTitle, imgUrl, imgThumbnailUrl, videoUrl, engLyrics, espLyrics, artistId])
      const [songData] = await connection.execute('SELECT id_song FROM songs WHERE id_api = ? AND title_song = ?', [id, title])
      const songId = songData[0].id_song
      console.log(artistId)
      console.log(songId)
      console.log(userId)
    } catch (err) {
      console.log('Error: ', err)
      throw err
    }
  }
}
