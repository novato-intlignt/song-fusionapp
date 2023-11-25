const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url
  if (filePath === './') {
    filePath = './public/index.html'
  }
  const extname = path.extname(filePath)
  const contentType = getContentType(extname)

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        res.writeHead(404, { 'Content-Type': 'text/html' })
        res.end(
          '404 Not Found'
        )
      } else {
        // Other types of error
        res.writeHead(500, { 'Content-Type': 'text/html' })// Corrige el código de estado a 500
        res.end('Internal Server Error')
      }
    } else {
      // File found, send content to the client
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(content, 'utf-8')
    }
  })
})

server.listen(3000, '127.0.0.1', () => {
  console.log('The server is listening at http://127.0.0.1:3000/')
})

function getContentType (extname) {
  switch (extname) {
    case '.html':
      return 'text/html'
    case '.css':
      return 'text/css'
    case '.js':
      return 'text/javascript'
    case '.ico':
      return 'text/ico'
    case '.svg':
      return 'text/svg'
    case '.png':
      return 'text/png'
  }
  console.log(extname)
}
