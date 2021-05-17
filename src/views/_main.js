
import Link from './components/link'

const Main = (data, slot) => (state, dispatch) => {
  const Slot = slot(state, dispatch)

  return (
    <div class='main'>
      <div class='main-side'>
        <Link to='/'>Instatistics</Link>
        <nav class='main-nav'>
          <Link to='/overview' class='-icon-overview' >Overview</Link>
          <Link to='/insights' class='-icon-insights' >Insights</Link>
          <Link to='/sources' class='-icon-sources' >Sources</Link>
          <Link to='/hashtags' class='-icon-hashtags -disabled'>Hashtags</Link>
          <Link to='/suggested' class='-icon-suggested -disabled' >Suggested</Link>
          <Link to='/discover' class='-icon-discover -disabled' >Discover</Link>
          <Link to='/discover' class='-icon-settings -disabled' >Settings</Link>
        </nav>
        <footer class='main-footer'>
          <h1>© Dustin Dowell, {state.footer.year}</h1>
          <p>By using this website you agree to our Terms of Use and Privacy Policy.</p>
        </footer>
      </div>
      <main>
        <h1>{data.title}</h1>
        {Slot}
      </main>
    </div>
  )
}

export default Main
