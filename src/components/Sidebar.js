
import cc from 'classcat'
import Link from 'views/components/link'

export default (props, children) => {
  const classList = cc({
    'component-sidebar': true,
    '-active': props.active
  })

  const navClassList = cc({
    'component-sidebar-nav': true,
    '-active': props.active
  })

  return (
    <div class={classList}>
      <Link to='/'>Insights</Link>
      <h2>Standard</h2>
      <nav class={navClassList}>
        <Link to='/overview' icon='ic-dashboard' >Overview</Link>
        <Link to='/hashtags' icon='ic-tag'>Hashtags</Link>
        <Link to='/sources' icon='ic-source' >Sources</Link>
      </nav>
      <h2>Premium</h2>
      <nav class={navClassList}>
        <Link to='/insights' icon='ic-insights'>Insights</Link>
        <Link to='/suggested' icon='ic-lightbulb'>Suggested</Link>
        <Link to='/discover' icon='ic-explore'>Discover</Link>
        <Link to='/discover' icon='ic-settings'>Settings</Link>
      </nav>
      {/* <footer>
        <h1>© Onclick LLC, {props.year ?? '2021'}</h1>
        <p>By using this website you agree to our Terms of Use and Privacy Policy.</p>
      </footer> */}
    </div>
  )
}
