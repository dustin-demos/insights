
import Main from './_main'
import Home from './prompt'

import * as sources from '../stores/sources'

const ImportJSON = data => {
  const change = event => {
    const reader = new FileReader()
    let filename = null

    reader.onload = event => {
      data.onImport({
        file: event.target.result,
        name: filename
      })
    }

    const file = event.target.files[0]
    filename = file.name

    reader.readAsText(file)
  }

  return (
    <label role='button' tabindex='0'>
      <input type='file' onchange={change} hidden />
      Import from JSON
    </label>
  )
}

const Table = data => {
  const target = []

  for (let i = data.imports.length; i--;) {
    const item = data.imports[i]
    const blob = new Blob([JSON.stringify(item)], { type: 'application/json' })
    const file = URL.createObjectURL(blob)

    target.push(
      <div class='sources-row'>
        <span>{new Date(item.date).toUTCString()}</span>
        <span>Posts: {item.posts.length}</span>
        <span>Name: {item.name}</span>
        <a download={`${item.date}-${item.name}`} href={file}>Download</a>
        <button onclick={() => data.onDelete(i)}>Delete</button>
      </div>
    )
  }

  return <div class='sources-table'>{target}</div>
}

const Overlay = (props, children) => {
  if (props.show) {
    return (
      <div class='sources-overlay'>
        <div>
          <div class='sources-close' onclick={props.onClose}></div>
          {children}
        </div>
      </div>
    )
  }
}

/**
 *
 * Actions
 *
 */

const enableOverlay = state => {
  state.sources.overlay = true
  return state
}

const disableOverlay = state => {
  state.sources.overlay = false
  return state
}

/**
 *
 * View
 *
 */

const Placeholder = (props, children) => {
  if (props.show) return children

  return (
    <div class='sources-placeholder'>
      Start by importing from instagram or a JSON file.
    </div>
  )
}

const Posts = ({ posts }) => {
  const target = []

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]

    console.log(post)

    target.push(
      <tr>
        <td>{post.id}</td>
        <td>{post.caption.slice(0, 36)}...</td>
        <td>{post.engagement}</td>
        <td>{post.impressions}</td>
        <td>{post.likes}</td>
        <td>{post.reach}</td>
        <td>{post.status || 'Live'}</td>
      </tr>
    )
  }

  return (
    <div class='sources-posts'>
      <h1>Posts</h1>
      <table>
        <tbody>{target}</tbody>
      </table>
    </div>
  )
}

const Sources = (state, dispatch) => {
  const open = () => {
    dispatch(enableOverlay)
  }

  const close = () => {
    dispatch(disableOverlay)
  }

  // move error handling into component??
  const importJSON = ({ name, file }) => {
    try {
      dispatch(sources.importJSON, file)
    } catch (error) {
      console.error(error)
      alert(`Error importing file: ${name}`)
    }
  }

  const removeImport = index => {
    dispatch(sources.deleteImport, index)
  }

  const date = Date.now()
  const json = JSON.stringify({ date, posts: state.sources.posts })

  const blob = new Blob([json], { type: 'application/json' })
  const file = URL.createObjectURL(blob)

  return (
    <div class='sources'>
      <div class='sources-foobar'>
        <div class='sources-import'>
          <button onclick={open}>Import from Instagram</button>
          <ImportJSON onImport={importJSON} />
          <a download={`${date}-compiled.json`} href={file}>Download All</a>
        </div>
        <Placeholder show={state.sources.imports.length > 0}>
          <Table imports={state.sources.imports} onDelete={removeImport} />
        </Placeholder>
        <Overlay show={state.sources.overlay} onClose={close}>
          {Home(state, dispatch)}
        </Overlay>
      </div>
      <Posts posts={state.sources.posts} />
    </div>
  )
}

export default {
  view: Main({ title: 'Sources' }, Sources),
  onroute: state => {}
}
