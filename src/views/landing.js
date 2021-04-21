
import { div, text } from '../lib/vnodes/html'

const Landing = () => {
  return div([
    text('landing')
  ])
}

export default {
  view: Landing,
  onroute: state => {}
}
