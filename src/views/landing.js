
import { div } from '../lib/vnodes/html'
import Link from './_link'

const Landing = () => {
  return div({ class: 'landing' }, [
    div({ class: 'landing-graphic' }, [
      Link({ to: '/overview' }, 'Continue to Insights')
    ])
  ])
}

export default {
  view: Landing,
  onroute: state => {}
}
