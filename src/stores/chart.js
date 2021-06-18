
const metrics = ['engagement', 'impressions', 'likes', 'reach', 'saved']

export const processMetrics = ({ chart }, posts) => {
  const target = {}

  for (let foo = 0; foo < posts.length; foo++) {
    const post = posts[foo]

    for (let bar = 0; bar < metrics.length; bar++) {
      const key = metrics[bar]
      const value = post[key]

      target[key] = target[key] ?? []
      target[key].push(value)
    }
  }

  chart.metrics = target

  return { chart }
}
