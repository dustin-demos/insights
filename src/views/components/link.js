
import { link } from '../../pocket/index'

export default (props, content) => {
  const classList = location.pathname === props.to
    ? props.class + ' -active'
    : props.class

  const to = event => {
    event.preventDefault()

    link({
      to: props.to,
      query: props.query
    })
  }

  return <a class={classList} href={props.to} onclick={to}>{content}</a>
}
