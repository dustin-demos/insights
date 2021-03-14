
import { svg, h, div } from '../lib/vnodes/html'

export const svgPath = props => h('path')(props)
export const svgCircle = props => h('circle')(props)

export const randomPoints = () => {
  const target = []
  for (let i = 0; i < 24; i++) {
    const x = Math.round((1024 / 24) * i) + 1024 / 48
    const y = Math.floor(Math.random() * Math.floor(60)) + 90
    target.push([x, y])
  }
  return target
}

export const pathFromPoints = points => {
  let target = 'M '
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i]
    target += ` ${x} ${y} L`
  }
  return target.slice(0, -2)
}

export const pointsFromPoints = points => {
  const target = []
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i]
    target.push(svgCircle({ cx: x, cy: y, r: 3, fill: '#0F77EF' }))
  }
  return target
}

export const gridLines = () => {
  const target = []
  for (let i = 1; i < 6; i++) {
    const x = 120 / 6 * i
    const path = svgPath({ stroke: '#24262a', d: `M 0 ${x} L 1024 ${x}` })
    target.push(path)
  }
  return target
}

/**
 * Generate a chart from a random set of points
 * @function randomChart
 */

const points = randomPoints()

export const randomChart = () => {
  return svg([
    ...gridLines(),
    ...pointsFromPoints(points),
    svgPath({
      'stroke': '#0F77EF',
      'stroke-width': 2,
      'fill': 'none',
      'd': pathFromPoints(points)
    })
  ])
}

/**
 *
 */

const chartWidth = 1024 / 2
const chartHeight = 120

export const chart = data => {
  // if (data.insights.data === null) {
  //   return div({ class: 'chart -overlay' }, [
  //     randomChart()
  //   ])
  // }

  const insights = data.insights
  const length = insights.length
  const max = Math.max(...insights.map(item => item.reach))
  const points = []

  for (let i = length; i--;) {
    const reach = insights[i].reach
    const offset = chartWidth / (length * 2)

    const x = Math.round(chartWidth / length * i) + offset
    const y = reach * ((chartHeight - 15) / max)

    points.push([x, chartHeight - y])
  }

  return div({ class: 'chart' }, [
    svg({ viewBox: `0 0 ${chartWidth} ${chartHeight}` }, [
      ...gridLines(),
      ...pointsFromPoints(points),
      svgPath({
        'stroke': '#1877f2',
        'fill': 'none',
        'd': pathFromPoints(points)
      })
    ])
  ])
}
