
import { div, h1, nav, p, text } from '../lib/vnodes/html'
import Link from './_link'

const Sidebar = data => {
  const target = []

  for (let i = 0; i < data.tabs.length; i++) {
    const tab = data.tabs[i]
    const item = Link({ class: tab.class, to: tab.to }, tab.name)

    target.push(item)
  }

  return div({ class: 'main-sidebar' }, [
    h1([
      text('Instatistics')
    ]),
    nav({ class: 'main-nav' }, target),
    div({ class: 'main-footer' }, [
      h1([
        text('© Onclick LLC, 2021')
      ]),
      p([
        text('By using this app you agree to our Terms of Use and Privacy Policy.')
      ])
    ])
  ])
}

const Main = slot => (state, dispatch) => {
  const Slot = slot(state, dispatch)

  return div({ class: 'main' }, [
    Sidebar({
      tabs: [
        { name: 'Overview', class: '-icon-overview', to: '/overview' },
        { name: 'Insights', class: '-icon-insights', to: '/insights' },
        { name: 'Sources', class: '-icon-hashtags', to: '/sources' }
        // { name: 'Statistics', class: '-icon-statistics', to: '/statistics' },
        // { name: 'Suggested', class: '-icon-suggested', to: '/suggested' },
        // { name: 'Discover', class: '-icon-discover', to: '/discover' }
      ]
    }),
    div({ class: 'main-slot' }, [
      Slot
    ])
  ])
}

export default Main
