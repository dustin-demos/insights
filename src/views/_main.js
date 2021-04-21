
import { div, h1, nav, p, text } from '../lib/vnodes/html'
import Link from './_link'

const Main = slot => (state, dispatch) => {
  const Slot = slot(state, dispatch)

  return div({ class: 'main' }, [
    div({ class: 'main-sidebar' }, [
      Link({ to: '/' }, 'Instatistics'),
      nav({ class: 'main-nav' }, [
        Link({ class: '-icon-overview', to: '/overview' }, 'Overview'),
        Link({ class: '-icon-insights', to: '/insights' }, 'Insights'),
        Link({ class: '-icon-sources', to: '/sources' }, 'Sources'),
        Link({ class: '-icon-hashtags -disabled', to: '/hashtags' }, 'Hashtags'),
        Link({ class: '-icon-suggested -disabled', to: '/suggested' }, 'Suggested'),
        Link({ class: '-icon-discover -disabled', to: '/discover' }, 'Discover'),
        Link({ class: '-icon-settings -disabled', to: '/discover' }, 'Settings')
      ]),
      div({ class: 'main-footer' }, [
        h1([
          text('© Dustin Dowell, 2021')
        ]),
        p([
          text('By using this website you agree to our\nTerms of Use and Privacy Policy.')
        ])
      ])
    ]),
    div({ class: 'main-slot' }, [
      Slot
    ])
  ])
}

export default Main
