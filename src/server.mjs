import express from 'express'
import morgan from 'morgan'

// Fix to __dirname in module scope
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT ?? 4000

// Middlewares
console.log('--- New request ---')
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
