
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
        text('© Dustin Dowell, 2021')
      ]),
      p([
        text('By using this website you agree to our\nTerms of Use and Privacy Policy.')
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
        { name: 'Sources', class: '-icon-sources', to: '/sources' },
        { name: 'Hashtags', class: '-icon-hashtags -disabled', to: '/hashtags' },
        { name: 'Suggested', class: '-icon-suggested -disabled', to: '/suggested' },
        { name: 'Discover', class: '-icon-discover -disabled', to: '/discover' },
        { name: 'Settings', class: '-icon-settings -disabled', to: '/discover' }
      ]
    }),
    div({ class: 'main-slot' }, [
      Slot
    ])
  ])
}

export default Main
