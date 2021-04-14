
import routerLink from '../lib/routerLink'
import { a, div, h1, text } from '../lib/vnodes/html'
import * as Chart from './chart'

const Text = (h, data) => h([text(data)])

const tabs = {
  stats: 'Stats',
  hashtags: 'Hashtags',
  combinations: 'Combinations'
  // suggested: 'Suggested Tags',
  // discover: 'Discover Tags'
}

const Tabs = data => {
  const children = []

  for (const key in tabs) {
    const tab = tabs[key]
    const classList = data.activeTab === key ? '-active' : ''

    const onclick = () => {
      data.changeTab(key)
    }

    children.push(
      div({ classList, onclick }, [
        text(tab)
      ])
    )
  }

  return div({ class: 'tabs' }, children)
}

const Stats = data => {
  const stats = data.stats
  const children = []

  for (let i = stats.length; i--;) {
    const stat = stats[i]

    const item = div({ class: 'stats-row' }, [
      div([
        text(stat.id)
      ]),
      div([
        text(stat.likes)
      ]),
      div([
        text(stat.engagement)
      ]),
      div([
        text(stat.reach)
      ])
    ])

    children.push(item)
  }

  return div({ class: 'stats' }, [
    div({ class: 'stats-head' }, [
      div([text('ID')]),
      div([text('Likes')]),
      div([text('Engagement')]),
      div([text('Reach')])
    ]),
    div({ class: 'stats-grid' }, children)
  ])
}

const Hashtags = data => {
  const { hashtags } = data

  if (hashtags.processed == null) {
    return div({
      class: 'hashtags',
      onclick: data.onCalculate
    }, [
      a({ class: 'button' }, [
        text('Calculate Hashtag Ranks')
      ])
    ])
  }

  const target = []

  for (let i = data.length; i--;) {
    const tag = data[i]
  }

  return div({ class: 'hashtags' }, target)
}

const Combinations = () => {
  return div([
    text('combinations')
  ])
}

const TabView = data => data.view()

const changeTab = (state, data) => {
  state.interface.activeTab = data
  return state.interface
}

const Insights = (state, dispatch) => {
  console.log(state)

  const routes = {
    'stats': () => Stats({
      stats: state.facebook.insights.data
    }),
    'hashtags': () => Hashtags({
      hashtags: state.hashtags,
      onCalculate: () => {
        dispatch(() => {
          console.log('not yet')
        })
      }
    }),
    'combinations': () => Combinations()
  }

  return div({ class: 'interface' }, [
    div({ class: 'titlebar' }, [
      Text(a, 'Onclick Insights')
    ]),
    div({ class: 'page' }, [
      div({ class: 'bar' }, [
        div({ class: 'avatar' }, [
          div(),
          div()
        ]),
        Text(h1, 'Hello, ' + 'whaley!'),
        a({ class: 'button' }, [text('Logout')])
      ]),
      div({ class: 'chart' }, [
        // Chart.randomChart()
        Chart.chart({
          insights: state.facebook.insights.data
        })
      ]),
      Tabs({
        activeTab: state.interface.activeTab,
        changeTab: name => {
          dispatch(changeTab, name)
        }
      }),
      TabView({
        view: routes[state.interface.activeTab]
      })
    ])
  ])
}

export default {
  view: Insights,
  onroute: state => {
    console.log('onroute >>>>', state.facebook)
    // const { login, insights } = state.facebook
    //
    // if (login.success === true && insights.success) {
    //   // do nothing
    // } else {
    //   routerLink({ to: '/' })
    // }
  }
}
