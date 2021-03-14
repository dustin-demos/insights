
const esbuild = require('esbuild')
const typescript = require('typescript')
const uglify = require('uglify-js')

let data = esbuild.buildSync({
  entryPoints: [
    process.argv[2]
  ],
  bundle: true,
  minify: true,
  write: false,
  define: {
    PROD: true,
    STATIC: false
  }
})

data = data.outputFiles[0].contents.buffer
data = Buffer.from(data).toString()

data = typescript.transpileModule(data, {
  compilerOptions: {
    allowJs: true,
    lib: [
      'DOM',
      'ES2015'
    ],
    target: 'ES5'
  }
})

data = uglify.minify(data.outputText, {
  toplevel: true,
  compress: {
    drop_console: true,
    passes: 3
  },
  mangle: {
    toplevel: true
  }
})

process.stdout.write(data.code)
