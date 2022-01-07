
import Main from './_main'

import Card from 'ui/Card'

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
  state.chart.range = range
  return state
}

const toggleMetric = ({ chart }, metric) => {
  chart.legend[metric] = !chart.legend[metric]
  return { chart }
}

/**
 *
 * View
 *
 */

const percentChanged = (a, b) => Math.round(((a - b) / a) * 10000) / 100
const percentStringify = number => number < 0 ? `${number}%` : `+${number}%`

const TopHashtag = data => {
  const content = data.combinations.length === 0
    ? 'Nothing yet...'
    : data.combinations[0].tag

  return <Card icon='ic-emoji-events' title='Top Hashtag'>{content}</Card>
}

const Overview = (state, dispatch) => {
  const actualChart = Chart.actualChart({
    range: state.chart.range,
    insights: state.sources.posts
  })

  const dropMenu = drop.Menu({
    isOpen: state.dropActive === 'range',
    label: `Last ${state.chart.range} Posts`,
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

  let posts = state.sources.posts
  posts = state.sources.posts.length < 1 ? [{}, {}] : posts
  const [recent, last] = posts

  const engagement = percentChanged(recent.engagement, last.engagement)
  const impressions = percentChanged(recent.impressions, last.impressions)
  const likes = percentChanged(recent.likes, last.likes)
  const reach = percentChanged(recent.reach, last.reach)
  const saved = percentChanged(recent.saved, last.saved)

  const chartNumberTwo = Chart.chart({
    chart: state.chart,
    posts: state.sources.posts,
    onClick: metric => {
      dispatch(toggleMetric, metric)
    }
  })

  // const chartNumberTwo = Chart.chart({
  //   chart: state.chart,
  //   onClick: metric => {
  //     dispatch(toggleMetric, metric)
  //   }
  // })

  const slot = {
    corner: dropMenu
  }

  return (
    <div class='overview'>
      <Card icon='ic-insights' title='Profile Overview' slot={slot}>
        {chartNumberTwo}
      </Card>
      <div class='overview-grid'>
        <div class='overview-chart'>
          <h1>Profile Overview</h1>
          {actualChart}
          <div class='overview-menu-container'>{dropMenu}</div>
        </div>
        <TopHashtag combinations={state.sources.combinations} />
        <Card icon='ic-chat' title='Engagement'>{percentStringify(engagement)}</Card>
        <Card icon='ic-people' title='Impressions'>{percentStringify(impressions)}</Card>
        <Card icon='ic-favorite' title='Likes'>{percentStringify(likes)}</Card>
        <Card icon='ic-campaign' title='Reach'>{percentStringify(reach)}</Card>
        <Card icon='ic-bookmark' title='Saved'>{percentStringify(saved)}</Card>
      </div>
    </div>
  )
}

export default {
  view: Main({ title: 'Overview' }, Overview),
  onRoute: state => {
    console.log('entering overview')
  },
  onBeforeLeave: state => {
    console.log('leaving overview')
  }
}
