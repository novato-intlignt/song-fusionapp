import { Router } from 'express'
import { SongController } from '../controllers/song.mjs'

export const getSongRouter = ({ songService }) => {
  const songRouter = Router()

  const songController = new SongController({ songService })

  songRouter.post('/song', songController.search)

  return songRouter
}
