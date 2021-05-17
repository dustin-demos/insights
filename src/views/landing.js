
import Link from './components/link'

const Landing = (state, dispatch) => {
  return (
    <div class='landing'>
      <div class='landing-graphic'>
        <Link to='/overview'>Continue to Insights</Link>
      </div>
      <div class='landing-footer'>
        © Dustin Dowell, {process.env.YEAR + '\n'}
        <a href='/legal'>Terms of Service</a>
        <a href='/legal'>Privacy Policy</a>
      </div>
    </div>
  )
}

export default {
  view: Landing,
  onroute: state => {}
}
