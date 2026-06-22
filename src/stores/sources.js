
/**
 *
 * Utilities
 *
 */

const byDate = (a, b) => b.date - a.date

/**
 *
 *
 * @function averageCombinations
 *
 */

const nearestHundred = number => Math.round(number * 100) / 100

// TODO: give "reach" a better name
const averageCombinations = (data, key) => {
  const averages = []
  const collect = {}
  const result = []

  for (let foo = data.length; foo--;) {
    const post = data[foo]
    const tags = post.caption.match(/#\w+/g)
    const reach = post[key]

    // Temp: ignore posts without reach
    if (reach === undefined) continue

    for (let bar = data.length - 1; bar--;) {
      if (foo === bar) continue // ingnore same post

      const nextPost = data[bar]
      const nextTags = nextPost.caption.match(/#\w+/g)
      const nextReach = nextPost[key]

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

const collectTags = (data, key) => {
  const target = {}

  for (let i = data.length; i--;) {
    const post = data[i]
    const tags = post.caption.match(/#\w+/g)
    // const reach = post.reach
    const reach = post[key]

    // NOTE: This is temporary until I implement JSON validation.
    // if (post.reach === undefined) continue
    if (post[key] === undefined) continue

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

  for (let i = latest.length; i--;) {
    latestIDs.push(latest[i].id)
  }

  for (let i = posts.length; i--;) {
    const post = posts[i]
    const title = titleRegex.exec(post.caption)

    post.modified = Date.now()

    if (title != null) {
      post.title = title[0].slice(0, -1).trim()
    }

    if (latestIDs.includes(post.id) === false) {
      post.archived = true
    }
  }

  return posts.sort(byDate)
}

/**
 *
 * I haven't thought of a good description for this function yet.
 * @function processSources
 *
 */

const process = (sources, key) => {
  const imports = sources.imports.sort(byDate)
  const posts = processPosts(compileImports(imports), (imports[0] || { posts: [] }).posts)

  sources.combinations = averageCombinations(posts, key)
  sources.posts = posts
  sources.tags = collectTags(posts, key)

  return sources
}

/**
 *
 * Actions
 *
 */

import { sampleImport } from './sampleData'

export const loadSampleData = ({ sources, hashtags }) => {
  const alreadyLoaded = sources.imports.some(i => i.name === sampleImport.name)

  if (!alreadyLoaded) {
    sources.imports.push(sampleImport)
    localStorage.setItem('imports', JSON.stringify(sources.imports))
  }

  return {
    sources: process(sources, hashtags.comboMethod)
  }
}

export const restoreImports = ({ sources, hashtags }) => {
  const json = localStorage.getItem('imports')

  if (typeof json === 'string') {
    sources.imports = JSON.parse(json)

    return {
      sources: process(sources, hashtags.comboMethod)
    }
  }
}

export const removeImport = ({ sources, hashtags }, index) => {
  if (sources.imports.length === 1) {
    sources.imports = []
    localStorage.removeItem('imports')
  } else {
    console.log(sources.imports, index)
    sources.imports.splice(index, 1)
    localStorage.setItem('imports', JSON.stringify(sources.imports))
  }

  return {
    sources: process(sources, hashtags.comboMethod)
  }
}

export const importJSON = ({ sources, hashtags }, data) => {
  sources.imports.push(JSON.parse(data))
  localStorage.setItem('imports', JSON.stringify(sources.imports))

  return {
    sources: process(sources, hashtags.comboMethod)
  }
}

export const importInstagram = ({ sources, hashtags }, data) => {
  sources.imports.push(data)
  sources.overlay = false

  localStorage.setItem('imports', JSON.stringify(sources.imports))

  return {
    sources: process(sources, hashtags.comboMethod)
  }
}

export const processSources = ({ sources, hashtags }) => {
  return {
    sources: process(sources, hashtags.comboMethod)
  }
}
