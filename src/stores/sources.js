
import * as chart from './chart'
import * as lambda from './lambda'

/**
 *
 * Utilities
 *
 */

const byDate = (a, b) => b.date - a.date

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
 * @function process
 *
 */

const metrics = ['engagement', 'impressions', 'likes', 'reach', 'saved']

const hasMetrics = post => {
  for (let i = 0; i < metrics.length; i++) {
    if (typeof post[metrics[i]] !== 'number') {
      return false
    }
  }

  return true
}

const process = (state, { key, sources }) => async dispatch => {
  const imports = sources.imports.sort(byDate)

  let posts = (imports[0] || { posts: [] }).posts
  posts = processPosts(compileImports(imports), posts)
  posts = posts.filter(hasMetrics)

  dispatch(chart.processMetrics, posts)
  await dispatch(lambda.combinations, { data: posts, key })

  sources.posts = posts

  return sources
}

/**
 *
 * Actions
 *
 */

export const restoreImports = ({ sources, hashtags }) => dispatch => {
  const json = localStorage.getItem('imports')

  if (typeof json === 'string') {
    sources.imports = JSON.parse(json)

    // return {
    //   sources: process(sources, hashtags.comboMethod)
    // }

    dispatch(process, {
      sources,
      key: hashtags.comboMethod
    })
  }
}

export const removeImport = ({ sources, hashtags }, index) => dispatch => {
  if (sources.imports.length === 1) {
    sources.imports = []
    localStorage.removeItem('imports')
  } else {
    console.log(sources.imports, index)
    sources.imports.splice(index, 1)
    localStorage.setItem('imports', JSON.stringify(sources.imports))
  }

  // return {
  //   sources: process(sources, hashtags.comboMethod)
  // }

  dispatch(process, {
    sources,
    key: hashtags.comboMethod
  })
}

export const importJSON = ({ sources, hashtags }, data) => dispatch => {
  sources.imports.push(JSON.parse(data))
  localStorage.setItem('imports', JSON.stringify(sources.imports))

  // return {
  //   sources: process(sources, hashtags.comboMethod)
  // }

  dispatch(process, {
    sources,
    key: hashtags.comboMethod
  })
}

export const importInstagram = ({ sources, hashtags }, data) => {
  sources.imports.push(data)
  sources.overlay = false

  localStorage.setItem('imports', JSON.stringify(sources.imports))

  return {
    sources: process(sources, hashtags.comboMethod)
  }
}

/**
 *
 * Actions
 *
 */

// probably just delete this and use process directly?
export const processSources = ({ sources, hashtags }) => dispatch => {
  dispatch(process, {
    sources,
    key: hashtags.comboMethod
  })

  // return {
  //   sources: process(sources, hashtags.comboMethod)
  // }
}
