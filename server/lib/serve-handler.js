
const fs = require('fs')
const path = require('path')

const directory = path.join(process.cwd(), 'public')
const reload = path.join(__dirname, '../reload.js')

const script = fs.readFileSync(reload)
const inject = '<script>' + script + '</script></body></html>'

const mime = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
}

function writeHandler (res) {
  return function (url) {
    const file = url.file
    const ext = url.ext

    fs.readFile(file, (err, data) => {
      if (err) {
        console.log('\n', err.message)
        return res.end() // stop execution
      }

      res.writeHead(200)
      res.end(ext === '.html' ? data.toString().slice(0, -14) + inject : data)
    })
  }
}

function urlHandler (url) {
  const ext = path.extname(url)

  if (ext === '') {
    return {
      file: path.join(directory, 'index.html'),
      ext: '.html'
    }
  }

  return {
    file: path.join(directory, url),
    ext: ext
  }
}

function handler (req, res) {
  const write = writeHandler(res)
  const url = urlHandler(req.url)

  res.setHeader('access-control-allow-origin', '*')
  res.setHeader('content-type', mime[url.ext] || 'text/plain')

  write(url)
}

module.exports = {
  handler: handler
}
