
/**
 *
 * Average Combinations
 *
 */

const HASHTAG_REGEX = /#\w+/g

const combinations = ({ data, key }) => {
  const averages = []
  const collect = {}
  const result = []

  for (let foo = data.length; foo--;) {
    const post = data[foo]
    const tags = post.caption.match(HASHTAG_REGEX)
    const metric = post[key]

    for (let bar = data.length - 1; bar--;) {
      if (foo === bar) continue

      const nextPost = data[bar]
      const nextTags = nextPost.caption.match(HASHTAG_REGEX)
      const nextMetric = nextPost[key]

      for (let baz = tags.length; baz--;) {
        const tag = tags[baz]

        if (nextTags.includes(tag)) {
          averages.push([tag, (metric + nextMetric) / 2])
        }
      }
    }
  }

  for (let foo = averages.length; foo--;) {
    const [tag, average] = averages[foo]

    collect[tag] === undefined
      ? collect[tag] = [average]
      : collect[tag].push(average)
  }

  for (const key in collect) {
    const averages = collect[key]
    const total = averages.reduce((a, b) => a + b)
    const length = averages.length

    if (length > 1) {
      result.push({
        tag: key,
        count: length,
        total: total,
        rank: Math.round((total / length) * 100) / 100
      })
    }
  }

  result.sort((a, b) => b.rank - a.rank)

  return result
}

/**
 *
 * Response Handler
 *
 */

exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {
    const { data, key } = JSON.parse(event.body)

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: combinations({ data, key })
      })
    }
  }
}
