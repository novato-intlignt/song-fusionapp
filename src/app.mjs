import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { createUserRouter } from './dev/routes/user.mjs'
import { getSongRouter } from './dev/routes/song.mjs'

// Fix to __dirname in module scope
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const createApp = ({ userModel, emailService, songService, songModel }) => {
  const app = express()
  const PORT = process.env.PORT ?? 4000

  // Middlewares
  app.use(morgan('dev'))
  app.use(express.json())
  app.use(cookieParser())
  app.disable('x-powered-by')
  app.use(express.static(path.join(__dirname, 'public')))

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
  })

  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
  })

  app.use('/user', createUserRouter({ userModel, emailService }))
  app.use('/song', getSongRouter({ songModel, songService }))

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}
