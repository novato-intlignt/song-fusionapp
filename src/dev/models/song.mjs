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
  static async search ({ input }) {
    const { song, artist } = input
    const [verifyArtist] = await connection.execute('SELECT id_artist FROM artists WHERE  LOWER(name_artist) = LOWER(?)', [artist])

    if (verifyArtist.length > 0) {
      const artistId = verifyArtist[0].id_artist
      const [searchSong] = await connection.execute('SELECT full_title FROM songs WHERE LOWER(title_song) = LOWER(?) AND id_artist = ?', [song, artistId])
      if (searchSong.length === 1) {
        return { status: 'exist', fullTitle: searchSong[0].full_title }
      }
      return { status: 'not_found' }
    }
    return { status: 'next' }
  }

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
      // Get the user ID
      const [userData] = await connection.execute('SELECT id_user FROM users WHERE name = ?', [user])
      if (userData.length <= 0) {
        return '/'
      }
      const userId = userData[0].id_user.toString('hex')

      // Verify if the artist is registered
      const [verifyArtist] = await connection.execute('SELECT id_artist FROM artists WHERE name_artist = ?', [artist])
      let artistId

      if (verifyArtist.length > 0) {
        artistId = verifyArtist[0].id_artist
      } else {
        // Crate and get the artist ID
        await connection.execute(
          'INSERT INTO artists (name_artist, img_artist) VALUES (?, ?)', [artist, imgArtist]
        )
        const [artistData] = await connection.execute('SELECT id_artist FROM artists WHERE name_artist = ?', [artist])
        artistId = artistData[0].id_artist
      }

      // Crate and get the song ID
      await connection.execute('INSERT INTO songs (id_api, title_song, full_title, img_url, img_thumbnail_url, video_song, eng_lyrics, esp_lyrics, id_artist) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        id,
        title,
        fullTitle,
        imgUrl,
        imgThumbnailUrl,
        videoUrl,
        engLyrics,
        espLyrics,
        artistId
      ])
      const [songData] = await connection.execute('SELECT id_song FROM songs WHERE id_api = ? AND title_song = ?', [id, title])
      const songId = songData[0].id_song

      // create the relation between user and songs
      const newUserSong = await connection.execute('INSERT INTO user_songs (id_user, id_song) VALUES(UNHEX(?), ?)', [userId, songId])

      if (newUserSong[0].affectedRows >= 1) {
        return { status: 'success' }
      } else {
        return { status: 'error' }
      }
    } catch (err) {
      console.log('Error: ', err)
      throw err
    }
  }
}
