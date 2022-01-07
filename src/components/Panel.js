
import cc from 'classcat'
import Toggle from 'ui/Toggle'

import css from 'modules/css-concat'
import once from 'modules/run-once'

import { dispatch } from 'app'
import * as common from 'stores/common'
import * as panel from 'stores/panel'

const onMounted = once()

/**
 *
 * Event Handlers
 *
 */

const dragStart = event => {
  dispatch(panel.setOffset, [
    event.offsetX,
    event.offsetY
  ])
}

const dragEnd = event => {
  dispatch(panel.setPosition, [
    event.clientX,
    event.clientY
  ])
}

const togglePanel = () => {
  dispatch(panel.toggle)
}

const toggleSidebar = () => {
  dispatch(common.toggle, 'sidebar')
}

const toggleFlashbang = () => {
  dispatch(common.toggle, 'flashbang')
}

/**
 *
 * Components
 *
 */

const Setting = props => {
  return (
    <div>
      <span>{props.off}</span>
      <Toggle active={props.active} onClick={props.onClick}/>
      <span>{props.on}</span>
    </div>
  )
}

/**
 *
 * Main Export
 *
 */

export default props => {
  const ref = { vnode: null }
  const [x, y] = props.panel.position

  const style = css({
    '--height': props.panel.height,
    'top': y + 'px',
    'left': x + 'px'
  })

  const panelClass = cc([
    'component-panel',
    props.panel.active && '-active'
  ])

  const settingsClass = cc([
    'component-panel-settings',
    props.panel.active && '-active'
  ])

  onMounted(() => {
    const height = ref.vnode.node.offsetHeight
    dispatch(panel.setHeight, height + 'px')
  })

  return (
    ref.vnode = <div draggable='true' class={panelClass} style={style} ondragstart={dragStart} ondragend={dragEnd}>
      <h1>Developer Panel</h1>
      <div class={settingsClass}>
        <Setting
          off='Default'
          on='Flashbang'
          active={props.flashbang}
          onClick={toggleFlashbang}
        />
        <hr/>
        <Setting
          off='Sidebar Closed'
          on='Sidebar Open'
          active={props.sidebar}
          onClick={toggleSidebar}
        />
      </div>
      <button alt='Toggle Developer Panel' onclick={togglePanel}></button>
    </div>
  )
}
