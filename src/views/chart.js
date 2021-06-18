
import * as html from 'pocket/tags/html'
import * as svg from 'pocket/tags/svg'

const randomInt = (min, max) => Math.floor(Math.random() * max) + min

/**
 *
 * Colors
 *
 */

const blue = '#0073ff'

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

const gradient = (id, fill) => {
  return svg.linearGradient({ id, gradientTransform: 'rotate(90)' }, [
    svg.stop({ 'stop-color': fill, 'stop-opacity': 0.25 }),
    svg.stop({ 'offset': '100%', 'stop-color': fill, 'stop-opacity': 0 })
  ])
}

const polygonGradient = (id, data) => {
  let d = 'M '

  for (let i = 0; i < data.length; i++) {
    const [x, y] = data[i]
    d += ` ${x} ${y} L`
  }

  return svg.path({
    fill: `url(#${id})`,
    d: d + ` ${480 - 24} ${144} L 48 ${144} Z`
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

export const dotsFromPoints = (fill, points) => {
  const target = []

  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i]
    const dot = svg.circle({ cx: x, cy: y, r: 2 })

    target.push(dot)
  }

  return svg.g({ fill }, target)
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
    gradient('gradient', blue),

    ...gridLines({ width, height }),

    polygonGradient('gradient', selection),
    dotsFromPoints(blue, selection),

    svg.path({
      'fill': 'none',
      'stroke-width': 1,
      'stroke': blue,
      'd': pathFromPoints(selection)
    })
  ])
}

/**
 *
 *
 * @function actualChart
 *
 */

const line = ({ id, fill, points }) => {
  const selection = plotPoints({ width, points })

  return [
    gradient(id, fill),
    // polygonGradient(id, selection),
    svg.path({
      'fill': 'none',
      'stroke-width': 1,
      'stroke': fill,
      'd': pathFromPoints(selection)
    }),
    dotsFromPoints(fill, selection)
  ]
}

export const actualChart = props => {
  /**
   *
   * collect raw points
   *
   */

  const engagement = []
  const impressions = []

  for (let i = props.insights.length; i--;) {
    const item = props.insights[i]

    if (typeof item.engagement === 'number') {
      if (typeof item.impressions === 'number') {
        engagement.push(item.engagement)
        impressions.push(item.impressions)
      }
    }
  }

  /**
   *
   * scale points
   *
   */

  const points = []
  const range = impressions.slice(Math.max(impressions.length - props.range, 0))

  const max = Math.max(...range)
  const ratio = height / max

  for (let i = 0; i < range.length; i++) {
    points.push(height - (range[i] * ratio))
  }

  //

  const _points = []
  const _range = engagement.slice(Math.max(engagement.length - props.range, 0))

  // const max = Math.max(...range)
  // const ratio = height / max

  for (let i = 0; i < _range.length; i++) {
    _points.push(height - (_range[i] * ratio))
  }

  /**
   *
   * the rest
   *
   */

  return html.svg({ viewBox: `0 0 ${width} ${height}` }, [
    ...gridLines({ width, height }),
    ...line({
      id: 'impressions',
      fill: 'var(--orange)',
      points: points
    }),
    ...line({
      id: 'engagement',
      fill: 'var(--red)',
      points: _points
    })
  ])
}

/**
 *
 * Main export
 *
 */

// This was an attempt at making stuff faster
// Its, kind of, but it might not actually be faster
// Also it renders the SVG backwards and idk why

// const metricPoints = ({ height, range, metrics, legend }) => {
//   const keys = []
//
//   for (const key in legend) {
//     if (legend[key] === true) {
//       keys.push(key)
//     }
//   }
//
//   const target = []
//   let max = 0
//
//   for (let i = keys.length; i--;) {
//     const key = keys[i]
//     const points = metrics[key].slice(0, range)
//     const value = Math.max.apply(null, points)
//
//     target[key] = target[key] ?? []
//     target[key] = points
//
//     if (value > max) {
//       max = value
//     }
//   }
//
//   const ratio = height / max
//
//   for (let i = keys.length; i--;) {
//     const key = keys[i]
//     const points = target[key]
//
//     for (let j = points.length; j--;) {
//       target[key][j] = height - (points[j] * ratio)
//     }
//   }
//
//   return target
// }

const metricPoints = ({ chart: { legend, range }, posts }) => {
  const target = {}
  let max = 0

  for (let i = Math.min(posts.length, range); i--;) {
    const post = posts[i] ?? {}

    for (const key in legend) {
      if (legend[key] === true) {
        const value = post[key]

        target[key] = target[key] ?? []
        target[key].push(value)

        if (value > max) {
          max = value
        }
      }
    }
  }

  const ratio = height / max

  for (const key in target) {
    const points = target[key]

    for (let i = 0; i < points.length; i++) {
      target[key][i] = height - (points[i] * ratio)
    }
  }

  return target
}

export const chart = props => {
  /**
   *
   * Legend
   *
   */

  const legend = []

  for (const key in props.chart.legend) {
    const style = `--legend-color: ${props.chart.colors[key]}`
    const classList = props.chart.legend[key] && '-checked'

    const onclick = () => {
      props.onClick(key)
    }

    legend.push(
      <button style={style} onclick={onclick}>
        <div class={classList}></div>
        <span>{key}</span>
      </button>
    )
  }

  /**
   *
   * SVG
   *
   */

  let children = gridLines({ width, height })

  // const foo = metricPoints(props.chart)

  const foo = metricPoints({
    chart: props.chart,
    posts: props.posts
  })

  for (const key in foo) {
    console.log(key, foo)

    children = children.concat(
      line({
        id: key,
        fill: props.chart.colors[key],
        points: foo[key]
      })
    )
  }

  /**
   *
   * View
   *
   */

  return (
    <div class='chart'>
      <div class='chart-legend'>{legend}</div>
      {html.svg({ viewBox: `0 0 ${width} ${height}` }, children)}
    </div>
  )
}
