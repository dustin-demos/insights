
import Main from './_main'
import shuffle from '../shuffle'

const Table = ({ head, data, onSelect, activeTags }) => {
  const target = data.map(item => {
    const values = Object.values(item)
    const tag = values[0]

    const click = () => {
      onSelect(tag)
    }

    const classList = activeTags.includes(tag) && '-active'

    return (
      <tr role='button' class={classList} onclick={click}>
        {values.map(item => <td>{item}</td>)}
      </tr>
    )
  })

  let gridColumns = ''

  for (let i = head.length; i--;) {
    gridColumns += ' 1fr'
  }

  return (
    <table style={`--table-columns: ${gridColumns}`}>
      <thead>
        {head.map(item => <th>{item}</th>)}
      </thead>
      <tbody>{target}</tbody>
    </table>
  )
}

const Hashtags = (state, dispatch) => {
  const combinations = Table({
    activeTags: state.activeTags,
    head: ['Tag', 'Combinations', 'Total Averages', 'Average Combination'],
    data: state.sources.combinations,
    onSelect: tag => {
      dispatch(state => {
        const index = state.activeTags.indexOf(tag)

        if (index === -1) {
          state.activeTags.unshift(tag)
        } else {
          state.activeTags.splice(index, 1)
        }

        return { activeTags: state.activeTags }
      })
    }
  })

  // const averages = Table({
  //   head: ['Tag', 'Count', 'Reach', 'Average'],
  //   data: state.sources.tags
  // })

  const tags = state.activeTags.join(' ')
  const shuffleTags = () => {
    dispatch(state => {
      return { activeTags: shuffle(state.activeTags) }
    })
  }

  return (
    <div class='hashtags insights'>
      <span>Selected Tags: {state.activeTags.length}</span>
      <div class='hashtags-selected'>
        <input type='text' value={tags} readonly />
        <button>Copy</button>
        <button onclick={shuffleTags}>Shuffle</button>
      </div>
      {combinations}
    </div>
  )
}

export default {
  view: Main({ title: 'Hashtags' }, Hashtags),
  onroute: state => {}
}
