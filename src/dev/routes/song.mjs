import { Router } from 'express'
import { SongController } from '../controllers/song.mjs'
import { METHODS as auth } from '../middlewares/auth.mjs'

export const getSongRouter = ({ songModel, songService }) => {
  const songRouter = Router()

  const songController = new SongController({ songModel, songService })

  songRouter.get('/', auth.userSong, songController.getAll)
  songRouter.post('/search', songController.search)
  songRouter.post('/lyric/:id', auth.userSong, songController.lyric)

  return songRouter
}
