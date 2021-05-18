
import Main from './_main'
import shuffle from '../shuffle'
import Placeholder from './components/placeholder'

/**
 *
 * Actions
 *
 */

const clearTags = () => {
  return { activeTags: [] }
}

const shuffleTags = state => {
  return { activeTags: shuffle(state.activeTags) }
}

/**
 *
 * View
 *
 */

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

  return <div class='hashtags-table'>
    <table style={`--table-columns: ${gridColumns}`}>
      <thead>
        {head.map(item => <th>{item}</th>)}
      </thead>
      <tbody>{target}</tbody>
    </table>
  </div>
}

const Chips = ({ array, onClear, onShuffle }) => {
  const len = array.length

  // if (len === 0) {
  //   return <div class='chips -placeholder'>
  //     <div>Start by selecting a few tags.</div>
  //   </div>
  // }

  const target = []

  for (let i = len; i--;) {
    target.push(
      <button>{array[i].slice(1)}</button>
    )
  }

  const onCopy = () => {
    const item = new ClipboardItem({
      'text/plain': new Blob([array.join(' ')], { type: 'text/plain' })
    })

    navigator.clipboard.write([item]).then(() => {
      console.log('copied!')
    }, err => {
      console.error(err)
    })
  }

  return <div class='chips'>
    <div class='chips-bar'>
      <h1>Selected Tags: {len}</h1>
      <button class='-copy' onclick={onCopy}>Copy</button>
      <button class='-shuffle' onclick={onShuffle}>Shuffle</button>
      <button class='-clear' onclick={onClear}>Clear</button>
    </div>
    <Placeholder show={target.length} message='Select tags in the table below.'>
      <div class='chips-list'>{target}</div>
    </Placeholder>
  </div>
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
          state.activeTags.push(tag)
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

  const clear = () => {
    dispatch(clearTags)
  }

  const shuffle = () => {
    dispatch(shuffleTags)
  }

  return (
    <div class='hashtags insights'>
      <Chips array={state.activeTags} onClear={clear} onShuffle={shuffle} />
      {combinations}
    </div>
  )
}

export default {
  view: Main({ title: 'Hashtags' }, Hashtags),
  onroute: state => {}
}
