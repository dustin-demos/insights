
import { div, h1, table, tbody, td, text, textarea, th, thead, tr } from '../lib/vnodes/html'
import Main from './_main'

const Row = (foo, bar, data) =>
  foo(data.map(item => bar([text(item)])))

const Table = ({ head, data }) => {
  const target = data.map(item => {
    const values = Object.values(item)
    return Row(tr, td, values)
  })

  let gridColumns = ''

  for (let i = head.length; i--;) {
    gridColumns += ' 1fr'
  }

  return table({ style: `--table-columns: ${gridColumns}` }, [
    Row(thead, th, head),
    tbody(target)
  ])
}

const Insights = (state, dispatch) => {
  return div({ class: 'insights' }, [
    div({ class: 'insights-head' }, [
      h1([
        text('Insights')
      ])
    ]),
    div({ class: 'insights-body' }, [
      textarea([
        text('#art #dominatrix')
      ]),
      Table({
        head: ['Tag', 'Combinations', 'Total Averages', 'Average Combination'],
        data: state.sources.combinations
      }),
      Table({
        head: ['Tag', 'Count', 'Reach', 'Average'],
        data: state.sources.tags
      })
    ])
  ])
}

export default {
  view: Main(Insights),
  onroute: state => {}
}
