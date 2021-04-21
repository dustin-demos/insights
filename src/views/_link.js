
import link from '../lib/routerLink'
import { a, text } from '../lib/vnodes/html'

export default (props, content) => {
  const classList = location.pathname === props.to
    ? props.class + ' -active'
    : props.class

  const onclick = event => {
    event.preventDefault()

    link({
      to: props.to,
      query: props.query
    })
  }

  return a({ class: classList, href: props.to, onclick }, [
    text(content)
  ])
}
