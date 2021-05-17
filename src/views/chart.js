
import * as html from '../pocket/tags/html'
import * as svg from '../pocket/tags/svg'

const randomInt = (min, max) => Math.floor(Math.random() * max) + min

/**
 *
 *
 *
 */

export const randomData = ({ length }) => {
  const target = []
  let y = 96

  for (let i = 0; i < length; i++) {
    y = (y + randomInt(24, 96)) / 2
    y = Math.round(y)

    target.push(y)
  }

  return target
}

const plotPoints = ({ points, width }) => {
  const target = []
  const length = points.length
  const distance = (width - 48 - 24) / (length - 1)

  for (let i = 0; i < length; i++) {
    let x = distance * i + 48
    x = Math.round(x)

    target.push([x, points[i]])
  }

  return target
}

/**
 *
 *
 *
 */

const gradientColor = '#0073ff'

const gradient = () => {
  return svg.linearGradient({
    id: 'gradient',
    gradientTransform: 'rotate(90)'
  }, [
    svg.stop({ 'stop-color': gradientColor + '3f' }),
    svg.stop({ 'offset': '100%', 'stop-color': gradientColor + '00' })
  ])
}

const polygonGradient = data => {
  let d = 'M '

  for (let i = 0; i < data.length; i++) {
    const [x, y] = data[i]
    d += ` ${x} ${y} L`
  }

  return svg.path({
    fill: 'url(#gradient)',
    d: d + ` ${480 - 24} ${144 - 24} L 48 ${144 - 24} Z`
  })
}

/**
 *
 *
 *
 */

export const gridLines = data => {
  const target = []
  const lineTarget = []
  const labelTarget = []

  for (let i = 1; i < 6; i++) {
    const y = data.height / 6 * i
    const width = data.width - 12

    const line = svg.path({ d: `M 36 ${y} L ${width} ${y}` })
    const label = svg.text({ 'x': 24, 'y': y }, [html.text(data.height - y)])

    lineTarget.push(line)
    labelTarget.push(label)
  }

  const lineGroup = svg.g({ stroke: '#20262f' }, lineTarget)
  const labelGroup = svg.g({
    'fill': '#dde3ee',
    'font-family': 'monospace',
    'font-size': '7px',
    'text-anchor': 'end'
  }, labelTarget)

  target.push(lineGroup)
  target.push(labelGroup)

  return target
}

/**
 *
 *
 *
 */

export const pathFromPoints = points => {
  let target = 'M '

  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i]
    target += ` ${x} ${y} L`
  }

  return target.slice(0, -2)
}

export const dotsFromPoints = points => {
  const target = []

  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i]
    const dot = svg.circle({ cx: x, cy: y, r: 2 })

    target.push(dot)
  }

  return svg.g({ fill: '#0073ff' }, target)
}

/**
 *
 * Generate a chart from a random set of points
 * @function randomChart
 *
 */

const width = 480
const height = 144
const length = 96

const points = randomData({ length })

export const randomChart = data => {
  const selection = plotPoints({
    width,
    points: points.slice(length - data.range)
  })

  return html.svg({ viewBox: `0 0 ${width} ${height}` }, [
    gradient(),

    ...gridLines({ width, height }),

    polygonGradient(selection),
    dotsFromPoints(selection),

    svg.path({
      'fill': 'none',
      'stroke-width': 1,
      'stroke': '#0073ff',
      'd': pathFromPoints(selection)
    })
  ])
}

/**
 *
 *
 *
 */

const chartWidth = 1024 / 2
const chartHeight = 120

export const chart = data => {
  const points = []
  const arr = []

  for (let i = data.insights.length; i--;) {
    const item = data.insights[i]

    if (typeof item.reach === 'number') {
      arr.push(item.reach)
    }
  }

  const max = Math.max(...arr)
  const length = arr.length

  for (let i = length; i--;) {
    const reach = arr[i]
    const offset = chartWidth / (length * 2)

    const x = Math.round(chartWidth / length * i) + offset
    const y = reach * ((chartHeight - 15) / max)

    points.push([x, chartHeight - y])
  }

  return (
    <div class='chart'>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {gridLines()}
        {dotsFromPoints(points)}
        <path stroke='#1877f2' fill='none' d={pathFromPoints(points)}></path>
      </svg>
    </div>
  )

  // return html.div({ class: 'chart' }, [
  //   html.svg({ viewBox: `0 0 ${chartWidth} ${chartHeight}` }, [
  //     ...gridLines(),
  //     ...dotsFromPoints(points),
  //     svg.path({
  //       'stroke': '#1877f2',
  //       'fill': 'none',
  //       'd': pathFromPoints(points)
  //     })
  //   ])
  // ])
}
