
import { div, text } from '../lib/vnodes/html'

const h = (tag, data) => tag([text(data)])

const Policy = (state, dispatch) => {
  return div({ class: 'policy' }, [
    h(div, 'Terms of Use and Privacy Policy')
  ])
}

export default {
  view: Policy,
  onroute: () => {}
}
