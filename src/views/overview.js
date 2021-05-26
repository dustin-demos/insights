
import Main from './_main'

import * as Chart from './chart'
import * as drop from './components/drop'

/**
 *
 * Actions
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

const dropSelect = (state, range) => {
  state.dropActive = false
  state.overview.chartRange = range
  return state
}

/**
 *
 * View
 *
 */

const Card = data => {
  return (
    <div class='overview-card'>
      <h1>{data.head}</h1>
      <p>{data.content}</p>
    </div>
  )
}

const TopHashtag = data => {
  const content = data.combinations.length === 0
    ? 'Nothing yet...'
    : data.combinations[0].tag

  return <Card head='Top Hashtag' content={content} />
}

const Overview = (state, dispatch) => {
  const actualChart = Chart.actualChart({
    range: state.overview.chartRange,
    insights: state.sources.posts
  })

  const dropMenu = drop.Menu({
    isOpen: state.dropActive === 'range',
    label: `Last ${state.overview.chartRange} Posts`,
    list: {
      'Last 12 Posts': 12,
      'Last 24 Posts': 24,
      'Last 36 Posts': 36,
      'Last 48 Posts': 48,
      'Last 60 Posts': 60,
      'Last 72 Posts': 72
    },
    onOpen: () => {
      dispatch(dropOpen, 'range')
    },
    onClose: () => {
      dispatch(dropClose)
    },
    onSelect: value => {
      dispatch(dropSelect, value)
    }
  })

  return (
    <div class='overview'>
      <div class='overview-grid'>
        <div class='overview-chart'>
          <h1>Profile Overview</h1>
          {/* {randomChart} */}
          {actualChart}
          <div class='overview-menu-container'>{dropMenu}</div>
        </div>
        <TopHashtag combinations={state.sources.combinations} />
        {/* <Card head='Engagement' content='+14.5%'></Card> */}
        {/* <Card head='Reach' content='+134.1%'></Card> */}
      </div>
    </div>
  )
}

export default {
  view: Main({ title: 'Overview' }, Overview),
  onroute: state => {}
}
