
import link from '../lib/routerLink'
import { a, text } from '../lib/vnodes/html'

export default (data, content) => {
  const props = {
    class: data.class + (location.pathname === data.to ? ' -active' : ''),
    href: data.to,
    onclick: event => {
      event.preventDefault()
      link({ to: data.to, query: data.query })
    }
  }

  return a(props, [text(content)])
}
