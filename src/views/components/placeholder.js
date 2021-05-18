
export default (props, slot) => {
  if (props.show) {
    return slot
  }

  return <div class='placeholder'>{props.message}</div>
}
