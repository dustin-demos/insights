
import cc from 'classcat'
import once from 'modules/run-once'

import Panel from 'components/Panel'
import Sidebar from 'components/Sidebar'

import { dispatch } from 'app'
import * as common from 'stores/common'

const onMounted = once()

const toggle = () => {
  dispatch(common.toggle, 'sidebar')
}

export default (props, children) => state => {
  onMounted(() => {
    if (window.innerWidth < 1024) {
      toggle()
    }
  })

  const classList = cc({
    'layout-dashboard': true,
    '-default': !state.flashbang,
    '-flashbang': state.flashbang,
    '-sidebar': state.sidebar
  })

  return (
    <div class={classList}>
      <div class='layout-dashboard-content'>
        <div class='layout-dashboard-head'>
          <h1>{props.title}</h1>
          <div class='component-layout-corner'>
            <div>
              <button alt='Menu' onclick={toggle}>|||</button>
            </div>
          </div>
        </div>
        {children(state, dispatch)}
      </div>
      <Sidebar active={state.sidebar}/>
      <Panel
        flashbang={state.flashbang}
        sidebar={state.sidebar}
        panel={state.panel}
      />
    </div>
  )
}
