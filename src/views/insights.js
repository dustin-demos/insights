
import { div, table, tbody, td, text, thead, tr } from '../lib/vnodes/html'
import Main from './_main'

/**
 *
 *
 */

const Cell = data => td([text(data)])

const Table = ({ tags }) => {
  const target = []

  for (let i = 0; i < tags.length; i++) {
    const item = tags[i]

    const row = tr([
      Cell(item.tag),
      Cell(item.count),
      Cell(item.reach),
      Cell(item.average)
    ])

    target.push(row)
  }

  return table({ class: 'statistics-table' }, [
    thead([
      Cell('Tag'),
      Cell('Count'),
      Cell('Total Reach'),
      Cell('Average Reach Per Post')
    ]),
    tbody(target)
  ])
}

const Hashtags = (state, dispatch) => {
  console.log('>>> state.sources', state.sources)
  console.log('>>> state.sources.tags', state.sources.tags)

  return div({ class: 'hashtags' }, [
    Table({
      tags: state.sources.tags
    })
  ])
}

export default {
  view: Main(Hashtags),
  onroute: state => {}
}
