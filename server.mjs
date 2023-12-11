import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname as _extname } from 'node:path'

const server = createServer(async (req, res) => {
  let filePath = '.' + req.url
  if (filePath === './') {
    filePath = './public/index.html'
  }
  const extname = _extname(filePath)
  const contentType = getContentType(extname)

  try {
    const content = await readFile(filePath)

    // File found, and send to the clilent
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(content)
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File not found
      res.writeHead(404, { 'Content-Type': 'text/html' })
      res.end('404 Not Found')
    } else {
      // Other types of error
      res.writeHead(500, { 'Content-type': 'text/html' })
      res.end('500 Internal Server Error')
    }
  }
})

server.listen(3000, '127.0.0.1', () => {
  console.log('The server is listening at http://127.0.0.1:3000/')
})

function getContentType (extname) {
  const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'
  }
  const DEF_MIME = 'text/plain'

  const contentType = MIME_TYPES[extname] || DEF_MIME

  return contentType
}
