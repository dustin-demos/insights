
import { table, tbody, td, text, th, thead, tr } from 'pocket/tags/html'

const TableHead = ({ keys }) => {
  const target = []

  for (let i = 0; i < keys.length; i++) {
    target.push(
      th([
        text(keys[i])
      ])
    )
  }

  return thead(target)
}

const TableBody = ({ keys, data }) => {
  const target = []

  for (let foo = 0; foo < data.length; foo++) {
    const obj = data[foo]
    const values = []

    for (let bar = 0; bar < keys.length; bar++) {
      values.push(
        td([
          text(obj[keys[bar]] || '-')
        ])
      )
    }

    target.push(tr(values))
  }

  return tbody(target)
}

export default props => {
  return table({ class: 'table', style: '--columns: ' + props.columns }, [
    TableHead(props),
    TableBody(props)
  ])
}
