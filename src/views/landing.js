
import * as facebookManual from '../stores/facebookManual'
// import Link from './components/link'

/**
 *
 * Components
 *
 */

const Overlay = props => {
  const classList = props.show ? 'overlay' : 'overlay -hidden'
  const click = () => props.onCancel()

  return (
    <div class={classList}>
      <div>
        <button onclick={click}>Cancel Login</button>
      </div>
    </div>
  )
}

/**
 *
 * View
 *
 */

const Landing = (state, dispatch) => {
  const activeSlide = state.landing.slides[state.landing.index]
  const slideStyles = `background-image: url(${activeSlide})`

  const click = () => {
    dispatch(facebookManual.openDialog)
  }

  return (
    <div>
      <div class='landing-hero'>
        <div class='landing-callout'>
          <h1>Optimize your tags.</h1>
          <h2>Use our fine-tuned heruristics to pick the best tags for posts using your own data.</h2>
          {/* <Link to='/overview'>Get Started for FREE</Link> */}
          <button onclick={click}>Get Started for FREE</button>
        </div>
      </div>
      <div class='landing-slider' style={slideStyles}></div>
      <div class='landing-footer'>
        © Onclick LLC, {process.env.YEAR + '\n'}
        <a href='/legal'>Terms of Service</a>
        <a href='/legal'>Privacy Policy</a>
      </div>
      {
        Overlay({
          show: state.facebookManual.popup === true,
          onCancel: () => {
            dispatch(facebookManual.cancelDialog)
          }
        })
      }
    </div>
  )
}

/**
 *
 * Actions
 *
 */

const nextSlide = ({ landing }) => {
  const index = landing.index + 1
  landing.index = index >= landing.slides.length ? 0 : index
  return { landing }
}

/**
 *
 * Export and stuff
 *
 */

let intervalID

export default {
  view: Landing,
  onRoute: (state, dispatch) => {
    intervalID = setInterval(() => { dispatch(nextSlide) }, 5000)
  },
  onBeforeLeave: () => {
    clearInterval(intervalID)
  }
}
