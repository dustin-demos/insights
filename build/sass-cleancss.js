
const CleanCSS = require('clean-css')
const sass = require('sass')

let data = sass.renderSync({
  file: process.argv[2],
  includePaths: [
    'node_modules'
  ]
})

data = new CleanCSS({ level: 2 }).minify(data.css)

process.stdout.write(data.styles)
