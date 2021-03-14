
import { div, text } from '../lib/vnodes/html'

const h = (tag, data) => tag([text(data)])

const Missing = (state, dispatch) => {
  return div({ class: 'missing' }, [
    h(div, '404 NOT FOUND')
  ])
}

export default {
  view: Missing,
  onroute: () => {}
}
