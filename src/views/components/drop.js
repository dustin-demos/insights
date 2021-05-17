
let lock = false

const focusIn = () => {
  lock = true
}

export const Menu = data => {
  const listItems = []

  const focusOut = () => {
    window.requestAnimationFrame(() => {
      if (lock === false) {
        data.onClose()
      }

      lock = false
    })
  }

  for (const key in data.list) {
    const select = () => {
      data.onSelect(data.list[key])
    }

    listItems.push(
      <li>
        <button onclick={select} onfocusin={focusIn} onfocusout={focusOut}>{key}</button>
      </li>
    )
  }

  return (
    <div class={data.isOpen ? 'drop' : 'drop -hidden'}>
      <button onclick={data.onOpen} onfocusout={focusOut}>{data.label}</button>
      <ul>{listItems}</ul>
    </div>
  )
}
