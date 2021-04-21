
import { a, div, text } from '../lib/vnodes/html'
import Link from './_link'

const Landing = (state, dispatch) => {
  return div({ class: 'landing' }, [
    div({ class: 'landing-graphic' }, [
      Link({ to: '/overview' }, 'Continue to Insights')
    ]),
    div({ class: 'landing-footer' }, [
      text('© Dustin Dowell, ' + state.footer.year + '\n'),
      a({ href: '/legal' }, [
        text('Terms of Service')
      ]),
      a({ href: '/legal' }, [
        text('Privacy Policy')
      ])
    ])
  ])
}

export default {
  view: Landing,
  onroute: state => {}
}
