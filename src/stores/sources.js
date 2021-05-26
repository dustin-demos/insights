
/**
 *
 *
 * @function averageCombinations
 *
 */

const nearestHundred = number => Math.round(number * 100) / 100

const averageCombinations = data => {
  const averages = []
  const collect = {}
  const result = []

  for (let foo = data.length; foo--;) {
    const post = data[foo]
    const tags = post.caption.match(/#\w+/g)
    const reach = post.reach

    // Temp: ignore posts without reach
    if (reach === undefined) continue

    for (let bar = data.length - 1; bar--;) {
      if (foo === bar) continue // ingnore same post

      const nextPost = data[bar]
      const nextTags = nextPost.caption.match(/#\w+/g)
      const nextReach = nextPost.reach

      // Temp: ignore posts without reach
      if (nextReach === undefined) continue

      for (let baz = tags.length; baz--;) {
        const tag = tags[baz]

        if (nextTags.includes(tag)) {
          averages.push([tag, (reach + nextReach) / 2])
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
        rank: nearestHundred(total / length)
      })
    }
  }

  result.sort((a, b) => b.rank - a.rank)

  return result
}

/**
 *
 *
 * @function collectTags
 *
 */

const collectTags = data => {
  const target = {}

  for (let i = data.length; i--;) {
    const post = data[i]
    const tags = post.caption.match(/#\w+/g)
    const reach = post.reach

    // NOTE: This is temporary until I implement JSON validation.
    if (post.reach === undefined) continue

    for (let i = tags.length; i--;) {
      const tag = tags[i]
      const current = target[tag]

      target[tag] = current === undefined
        ? { count: 1, reach: reach }
        : { count: current.count + 1, reach: current.reach + reach }
    }
  }

  const result = []

  for (const key in target) {
    const item = target[key]

    result.push({
      tag: key,
      count: item.count,
      reach: item.reach,
      average: item.reach / item.count
    })
  }

  result.sort((a, b) => b.average - a.average)

  return result
}

/**
 *
 * Reduce all sources into an array.
 * @function compileSources
 *
 */

const compileImports = data => {
  const target = []
  const uniqueIDs = []

  for (let i = 0; i < data.length; i++) {
    const posts = data[i].posts

    for (let i = posts.length; i--;) {
      const post = posts[i]

      if (uniqueIDs.includes(post.id) === false) {
        target.push(post)
        uniqueIDs.push(post.id)
      }
    }
  }

  return target
}

/**
 *
 * I haven't thought of a good description for this function yet.
 * @function processPosts
 *
 */

const titleRegex = /^.*?~/

const processPosts = (posts, latest) => {
  const latestIDs = []

  for (let i = 0; i < latest.length; i++) {
    latestIDs.push(latest[i].id)
  }

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const title = titleRegex.exec(post.caption)

    post.modified = Date.now()

    if (latestIDs.includes(post.id) === false) {
      post.archived = true
    }

    if (title != null) {
      post.title = title[0].slice(0, -1).trim()
    }
  }

  return posts
}

/**
 *
 * I haven't thought of a good description for this function yet.
 * @function processSources
 *
 */

const byDate = (a, b) => b.date - a.date

const process = sources => {
  const imports = sources.imports.sort(byDate)
  const posts = processPosts(compileImports(imports), (imports[0] || { posts: [] }).posts)

  sources.combinations = averageCombinations(posts)
  sources.posts = posts
  sources.tags = collectTags(posts)

  return sources
}

/**
 *
 * Actions
 *
 */

export const restoreImports = ({ sources }) => {
  const json = localStorage.getItem('imports')

  if (typeof json === 'string') {
    sources.imports = JSON.parse(json)

    return {
      sources: process(sources)
    }
  }
}

export const removeImport = ({ sources }, index) => {
  if (sources.imports.length === 1) {
    sources.imports = []
    localStorage.removeItem('imports')
  } else {
    console.log(sources.imports, index)
    sources.imports.splice(index, 1)
    localStorage.setItem('imports', JSON.stringify(sources.imports))
  }

  return {
    sources: process(sources)
  }
}

export const importJSON = ({ sources }, data) => {
  sources.imports.push(JSON.parse(data))
  localStorage.setItem('imports', JSON.stringify(sources.imports))

  return {
    sources: process(sources)
  }
}

export const importInstagram = ({ sources }, data) => {
  sources.imports.push(data)
  sources.overlay = false

  localStorage.setItem('imports', JSON.stringify(sources.imports))

  return {
    sources: process(sources)
  }
}
