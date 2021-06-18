
import memoize from 'pocket/memoize'
import shuffle from 'shuffle-array'

import Main from './_main'
import * as sources from '../stores/sources'

import Placeholder from './components/placeholder'
import * as drop from './components/drop'

/**
 *
 * Utilities
 *
 */

const clipboard = (data, callback) => {
  const item = new ClipboardItem({ // eslint-disable-line
    'text/plain': new Blob([data], { type: 'text/plain' })
  })

  navigator.clipboard.write([item]).then(callback, err => {
    console.error(err)
  })
}

/**
 *
 * Drop Menu Actions
 *
 */

const dropOpen = (state, uid) => {
  state.dropActive = state.dropActive === uid ? null : uid
  return state
}

const dropClose = state => {
  state.dropActive = false
  return state
}

// NOTE:
// this doesn't need to be an async function but it's easier this way
// pocket is kind of scuffed in these kinds of situations
const dropSelect = (state, { key, value }) => async dispatch => {
  state.dropActive = false
  state.hashtags.comboMethod = value
  state.hashtags.comboMethodName = key

  dispatch(sources.processSources)

  return state
}

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

const flash = (state, data) => async dispatch => {
  if (state.copyFlash && data) {
    window.requestAnimationFrame(() => {
      dispatch(flash, true)
    })

    return { copyFlash: false }
  }

  return { copyFlash: data }
}

/**
 *
 * View
 *
 */

const memo = memoize(target => target.length === 0)

const Table = props => {
  const { head, onSelect, activeTags } = props
  const target = []

  for (let i = 0; i < props.data.length; i++) {
    const item = props.data[i]
    const values = Object.values(item)
    const tag = values[0]
    const classList = activeTags.includes(tag) && '-active'
    const click = () => { onSelect(tag) }

    target.push(
      <tr role='button' class={classList} onclick={click}>
        {values.map(item => <td>{item}</td>)}
      </tr>
    )
  }

  let gridColumns = ''
  for (let i = head.length; i--;) {
    gridColumns += ' 1fr'
  }

  const classList = props.loading === true
    ? 'hashtags-table -loading'
    : 'hashtags-table'

  return <div class={classList}>
    <table style={`--table-columns: ${gridColumns}`}>
      <thead>
        {head.map(item => <th>{item}</th>)}
      </thead>
      <tbody>{memo('tbody', target)}</tbody>
    </table>
  </div>
}

const Chips = ({ array, flash, onClear, onCopy, onFlashEnd, onShuffle }) => {
  const len = array.length
  const target = []
  const classList = flash ? 'chips -flash' : 'chips'

  for (let i = len; i--;) {
    target.push(
      <button>{array[i].slice(1)}</button>
    )
  }

  const copy = () => {
    clipboard(array.join(' '), onCopy)
  }

  return <div class={classList} onanimationend={onFlashEnd}>
    <div class='chips-bar'>
      <h1>Selected Tags: {len}</h1>
      <button class='-copy' onclick={copy}>Copy</button>
      <button class='-shuffle' onclick={onShuffle}>Shuffle</button>
      <button class='-clear' onclick={onClear}>Clear</button>
    </div>
    <Placeholder show={target.length} message='Select tags in the table below.'>
      <div class='chips-list'>{target}</div>
    </Placeholder>
  </div>
}

const Hashtags = (state, dispatch) => {
  const combo = Table({
    activeTags: state.activeTags,
    head: ['Tag', 'Combinations', 'Total Averages', 'Average Combination'],

    // what can i do about this besides ?? []
    data: state.lambda.combinations.data ?? [],
    loading: state.lambda.combinations.loading,

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

  const TagChips = Chips({
    array: state.activeTags,
    flash: state.copyFlash,
    onFlashEnd: () => {
      dispatch(flash, false)
    },
    onCopy: () => {
      dispatch(flash, true)
    },
    onClear: () => {
      dispatch(clearTags)
    },
    onShuffle: () => {
      dispatch(shuffleTags)
    }
  })

  const DropMenu = drop.Menu({
    isOpen: state.dropActive === 'combo',
    label: `Calculate Combinations using: ${state.hashtags.comboMethodName}`,
    list: {
      'Engagement': 'engagement',
      'Impressions': 'impressions',
      'Likes': 'likes',
      'Reach': 'reach',
      'Saved': 'saved'
    },
    onOpen: () => {
      dispatch(dropOpen, 'combo')
    },
    onClose: () => {
      dispatch(dropClose)
    },
    onSelect: (value, key) => {
      dispatch(dropSelect, { key, value })
    }
  })

  return (
    <div class='hashtags'>
      {TagChips}
      <div class='hashtags-combo'>
        <h1>Combinations</h1>
        <div class='hashtags-menu-container'>{DropMenu}</div>
      </div>
      {combo}
    </div>
  )
}

export default {
  view: Main({ title: 'Hashtags' }, Hashtags),
  onroute: state => {}
}
