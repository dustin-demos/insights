
let lock = false

const focusIn = () => {
  lock = true
}

export const Menu = props => {
  const listItems = []

  const focusOut = () => {
    window.requestAnimationFrame(() => {
      if (lock === false) {
        props.onClose()
      }

      lock = false
    })
  }

  for (const key in props.list) {
    const select = () => {
      props.onSelect(props.list[key], key)
    }

    listItems.push(
      <li>
        <button onclick={select} onfocusin={focusIn} onfocusout={focusOut}>{key}</button>
      </li>
    )
  }

  return (
    <div class={props.isOpen ? 'drop' : 'drop -hidden'}>
      <button onclick={props.onOpen} onfocusout={focusOut}>{props.label}</button>
      <ul>{listItems}</ul>
    </div>
  )
}
