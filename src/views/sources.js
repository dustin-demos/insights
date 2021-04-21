
import { button, div, h1, input, label, span, text } from '../lib/vnodes/html'

import Main from './_main'
import Home from './home'

import * as sources from '../stores/sources'

/**
 *
 *
 */

const ImportInstagram = data => {
  return button({
    onclick: () => {
      data.onImport()
    }
  }, [
    text('Import from Instagram')
  ])
}

const ImportJSON = data => {
  return label([
    input({
      type: 'file',
      hidden: true,
      onchange: event => {
        const reader = new FileReader()
        let filename = null

        reader.onload = event => {
          data.onImport({
            data: event.target.result,
            name: filename
          })
        }

        const file = event.target.files[0]
        filename = file.name

        reader.readAsText(file)
      }
    }),
    text('Import from JSON')
  ])
}

const ImportsTable = data => {
  const target = []

  for (let i = 0; i < data.imports.length; i++) {
    const item = data.imports[i]

    const row = div({ class: 'sources-row' }, [
      span([
        text('Date: ' + new Date(item.date).toUTCString())
      ]),
      span([
        text('Name: ' + item.name)
      ]),
      span([
        text('Posts: ' + item.posts.length)
      ]),
      button({
        onclick: () => {
          data.onDelete(i)
        }
      }, [
        text('Delete')
      ])
    ])

    target.push(row)
  }

  return div({ class: 'sources-table' }, target)
}

const Overlay = (props, children) => {
  if (props.show) {
    return div({ class: 'sources-overlay' }, [
      div([
        div({ class: 'sources-close', onclick: props.onClose }),
        ...children
      ])
    ])
  }
}

const Sources = (state, dispatch) => {
  return div({ class: 'sources' }, [
    div({ class: 'sources-head' }, [
      h1([
        text('Sources')
      ])
    ]),
    div({ class: 'sources-import' }, [
      ImportInstagram({
        onImport: data => {
          dispatch(({ sources }) => {
            sources.overlay = true
            return { sources }
          })
        }
      }),
      ImportJSON({
        onImport: data => {
          try {
            dispatch(sources.importJSON, data)
          } catch (error) {
            alert('Error importing file')
          }
        }
      })
    ]),
    ImportsTable({
      imports: state.sources.imports,
      onDelete: index => {
        dispatch(sources.deleteImport, { index })
      }
    }),
    Overlay({
      show: state.sources.overlay,
      onClose: () => {
        dispatch(({ sources }) => {
          sources.overlay = false
          return { sources }
        })
      }
    }, [
      Home(state, dispatch)
    ])
  ])
}

export default {
  view: Main(Sources),
  onroute: state => {}
}
