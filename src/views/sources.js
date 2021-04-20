
import { button, div, h1, input, label, span, text } from '../lib/vnodes/html'
import Main from './_main'
import * as sources from '../stores/sources'

/**
 *
 *
 */

const ImportInstagram = () => {
  return button([
    text('Import from Instagram')
  ])
}

const ImportJSON = data => {
  return label({
    onclick: () => {
      console.log('clicky')
    }
  }, [
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
          dispatch(sources.importJSON, data)
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
    })
  ])
}

export default {
  view: Main(Sources),
  onroute: state => {}
}
