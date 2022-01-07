
export default (props, children) => {
  return (
    <div class='ui-card'>
      <div class='ui-card-head'>
        <h1 class={props.icon ?? '-no-icon'}>{props.title}</h1>
        <div class='ui-card-corner'>
          <div>
            {props.slot && props.slot.corner}
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
