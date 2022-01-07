
import { pocket } from 'pocket/index'
import { patch } from 'superfine'
// import fetchCache from 'fetch-from-cache/index'

import * as common from './stores/common'
import * as panel from './stores/panel'

import * as facebookManual from './stores/facebookManual'
import * as lambda from './stores/lambda'

// These stores are a bit crusty
import * as facebook from './stores/facebook'
import * as prompt from './stores/prompt'

import Facebook from './views/facebook'
import Landing from './views/landing'
import Missing from './views/missing'
import Palette from './views/palette'

import Overview from './views/overview'
import Hashtags from './views/hashtags'
import Sources from './views/sources'

import Foobar from 'pages/Foobar'

import * as subs from './subs'
import * as sources from './stores/sources'

/**
 *
 * Initialize
 *
 */

const node = document.getElementById('app')
const app = init => pocket(init, view => patch(node, view))

export const dispatch = app({
  state: {
    ...common.state,
    panel: panel.state,

    facebookManual: facebookManual.state,
    lambda: lambda.state,

    landing: {
      index: 0,
      slides: [
        '/tmp/slide-0.png',
        '/tmp/slide-1.png'
      ]
    },
    chart: {
      width: 480,
      height: 144,
      range: 24,
      // metrics: {
      //   engagement: [],
      //   impressions: [],
      //   likes: [],
      //   reach: [],
      //   saved: []
      // },
      colors: {
        engagement: 'var(--blue)',
        impressions: 'var(--green)',
        likes: 'var(--yellow)',
        reach: 'var(--orange)',
        saved: 'var(--red)'
      },
      legend: {
        engagement: true,
        impressions: true,
        likes: false,
        reach: false,
        saved: false
      }
    },

    activeTags: [],
    copyFlash: false,
    dropActive: null,

    hashtags: {
      comboMethod: 'reach', // rename to comboMetric?
      comboMethodName: 'Reach' // rename to comboMetricName?
    },
    sources: {
      overlay: false, // Move this somewhere else

      combinations: [],
      imports: [],
      posts: []
    },

    facebook: facebook.state,
    prompt: prompt.state,

    footer: {
      year: process.env.YEAR
    },
    persist: {
      lock: null
    }
  },
  middleware: {
    facebook: () => {
      // whatever you want here
      // code here will act as a place to store temporary data
      // stuff like listeners and intervals
      return {
        onRoute: () => {},
        onBeforeLeave: () => {}
      }
    },
    slideshow: () => {
      let intervalID

      const nextSlide = ({ landing }) => {
        const index = landing.index + 1
        landing.index = index >= landing.slides.length ? 0 : index
        return { landing }
      }

      return {
        onRoute: dispatch => {
          console.log('set interval')
          intervalID = setInterval(() => { dispatch(nextSlide) }, 5000)
        },
        onBeforeLeave: () => {
          console.log('clear interval')
          clearInterval(intervalID)
        }
      }
    }
  },
  pages: {
    '/': Landing,
    '/fb': Facebook,

    '/missing': Missing,
    '/palette': Palette,

    '/overview': Overview,
    '/hashtags': Hashtags,
    '/sources': Sources,

    '/foobar': Foobar

    // '/discover': Discover,
    // '/suggested': Suggested,
  }
})

/**
 *
 * Subscriptions
 *
 */

subs.gtm({ id: 'GTM-NRNQM2M' })
subs.fbsdk()

dispatch(sources.restoreImports)

/**
 *
 * Third Party
 *
 */

// Facebook SDK
window.fbAsyncInit = () => {
  FB.init({
    appId: '813793032539615',
    version: 'v10.0'
  })
}

// Google Tag Manager
window.dataLayer = window.dataLayer || []
window.dataLayer.push({
  'gtm.start': Date.now(),
  'event': 'gtm.js'
})
