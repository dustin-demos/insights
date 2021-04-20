
function average (data) {
  let total = 0
  for (let aa = 0; aa < data.length; aa++) {
    total += data[aa]
  }
  return total / aa
}

function split (data) {
  const target = []
  for (let aa = 0; aa < data.length; aa++) {
    const row = data[aa]
    if (row[0] !== '') {
      target.push([row[0].split(' '), row[1]])
    }
  }
  return target
}

/**
 *
 * @function averageCombinations
 */

const averageCombinations = data => {
  const target = []
  const collect = {}
  const final = []
  const posts = split(data)

  for (let xx = 0; xx < posts.length; xx++) {
    const row = posts[xx][0]
    const reach = posts[xx][1]

    for (let aa = 0; aa < posts.length; aa++) {
      // ignore same post
      if (xx === aa) {
        continue
      }

      const nextRow = posts[aa][0]; const nextReach = posts[aa][1]

      for (let bb = 0; bb < row.length; bb++) {
        const tag = row[bb]

        if (nextRow.indexOf(tag) !== -1) {
          target.push([tag, (reach + nextReach) / 2])
        }
      }
    }
  }

  for (let cc = 0; cc < target.length; cc++) {
    const row = target[cc]
    const tag = row[0]
    const reach = row[1]

    if (collect[tag] === undefined) {
      collect[tag] = [reach]
    } else {
      collect[tag].push(reach)
    }
  }

  for (const key in collect) {
    const value = collect[key]

    if (value.length > 1) {
      final.push([key, average(value)])
    }
  }

  return final
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

      sources.imports = imports
      sources.tags = collectTags(posts)
      sources.processing = false

      return { sources }
    }
  }
}

/**
 *
 * @function deleteImport
 */

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

  const posts = collectPosts(sources.imports)
  sources.tags = collectTags(posts)

  const json = JSON.stringify(sources.imports)
  localStorage.setItem('imports', json)

  return { sources }
}

/**
 *
 * State
 *
 */

export const state = {}
