
const map = {
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  brightBlack: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m'
}

function color (name, string) {
  return map[name] + string + '\x1b[0m'
}

function dots (len) {
  let target = ''

  for (let i = 0; i < len; i++) {
    target += '.'
  }

  return target
}

module.exports = function (command, data) {
  const time = new Date().toLocaleString().split(', ')[1]
  const gap = process.stdout.columns - 26 - command.length - time.length

  console.log()
  console.log(
    color('brightRed', '/// ... ['),
    color('white', command.toUpperCase()),
    color('brightRed', '] ' + dots(gap) + ' ['),
    color('white', time),
    color('brightRed', '] ... ///')
  )

  if (typeof data === 'string') {
    console.log(data.trim())
  }
}
