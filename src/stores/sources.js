
/**
 *
 * @function averageCombinations
 */

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
        rank: total / length
      })
    }
  }

  result.sort((a, b) => b.rank - a.rank)

  return result
}

/**
 *
 * @function collectPosts
 */

const collectPosts = data => {
  let posts = []

  for (let i = data.length; i--;) {
    posts = posts.concat(data[i].posts)
  }

  return posts
}

/**
 *
 * @function collectTags
 */

const collectTags = data => {
  const target = {}

  for (let i = 0; i < data.length; i++) {
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
 * @function restoreImports
 */

export const restoreImports = ({ sources }) => {
  const json = localStorage.getItem('imports')

  if (typeof json === 'string') {
    const imports = JSON.parse(json)

    if (imports.length > 0) {
      const posts = collectPosts(imports)

      sources.combinations = averageCombinations(posts)
      sources.imports = imports
      sources.tags = collectTags(posts)

      return { sources }
    }
  }
}

/**
 *
 * @function deleteImport
 */

// TODO: when deleting an import tags and combinations need to be re-processed

export const deleteImport = ({ sources }, data) => {
  if (sources.imports.length === 1) {
    sources.imports = []
    localStorage.removeItem('imports')
  } else {
    sources.imports.splice(data.index)
    localStorage.setItem('imports', JSON.stringify(sources.imports))
  }

  return { sources }
}

/**
 *
 * @function importJSON
 */

export const importJSON = ({ sources }, data) => {
  sources.imports.push({
    date: Date.now(),
    name: data.name,
    posts: JSON.parse(data.data)
  })

  const json = JSON.stringify(sources.imports)
  const posts = collectPosts(sources.imports)

  sources.combinations = averageCombinations(posts)
  sources.tags = collectTags(posts)

  localStorage.setItem('imports', json)

  return { sources }
}

// /**
//  *
//  * @function importData
//  */
//
// export const importData = ({ sources }, data) => {
//   sources.imports.push({
//     date: Date.now(),
//     name: data.name,
//     posts: data.data
//   })
//
//   const json = JSON.stringify(sources.imports)
//   const posts = collectPosts(sources.imports)
//
//   sources.combinations = averageCombinations(posts)
//   sources.tags = collectTags(posts)
//
//   localStorage.setItem('imports', json)
//
//   return { sources }
// }

/**
 *
 * State
 *
 */

export const state = {}
