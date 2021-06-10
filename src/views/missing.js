
import { div, text } from 'pocket/tags/html'

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
