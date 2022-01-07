
import Dashboard from 'layouts/Dashboard'
import Toggle from 'ui/Toggle'

const Foobar = (state, dispatch) => {
  return (
    <div>
      <div>Hello I am content for the page "Foobar".</div>
      <Toggle/>
    </div>
  )
}

export default {
  view: Dashboard({ title: 'Roobar' }, Foobar),
  onRoute: () => {
    console.log('Foobar >> onRoute')
  },
  onBeforeLeave: () => {
    console.log('Foobar >> onBeforeLeave')
  }
}
