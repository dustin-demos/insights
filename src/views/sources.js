
import Main from './_main'
import Home from './prompt'

import * as facebookManual from '../stores/facebookManual'
import * as facebookManualLib from '../stores/facebookManualLib'
import * as sources from '../stores/sources'

import Placeholder from './components/placeholder'
import Table from './components/table'

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

const SourcesTable = data => {
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

const Sources = (state, dispatch) => {
  const manualFacebookLogin = () => {
    dispatch(facebookManual.openDialog)
  }

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
    dispatch(sources.removeImport, index)
  }

  const date = Date.now()
  const json = JSON.stringify({ date, posts: state.sources.posts })

  const blob = new Blob([json], { type: 'application/json' })
  const file = URL.createObjectURL(blob)

  return (
    <div class='sources'>
      <div class='sources-foobar'>
        <div class='sources-import'>
          <button onclick={manualFacebookLogin}>Manual Facebook Login</button>
          <button onclick={open}>Import from Instagram</button>
          <ImportJSON onImport={importJSON} />
          <a download={`${date}-compiled.json`} href={file}>Download All</a>
        </div>
        <Placeholder show={state.sources.imports.length} message='Start by importing from instagram or a JSON file.'>
          <SourcesTable imports={state.sources.imports} onDelete={removeImport} />
        </Placeholder>
        <Overlay show={state.sources.overlay} onClose={close}>
          {Home(state, dispatch)}
        </Overlay>
      </div>
      <div class='sources-posts'>
        <h1>Posts</h1>
        {
          Table({
            columns: '2fr 3fr 1fr 1fr 1fr 1fr',
            keys: ['title', 'caption', 'likes', 'saved', 'reach', 'archived'],
            data: state.sources.posts
          })
        }
      </div>
    </div>
  )
}

/**
 *
 *  Waiting for the Facebook login popup to send use a message
 *
 */

const listener = facebookManualLib.dialogListener()

export default {
  view: Main({ title: 'Sources' }, Sources),
  onRoute: (state, dispatch) => {
    listener.add(dispatch)
  },
  onBeforeLeave: () => {
    listener.remove()
  }
}
