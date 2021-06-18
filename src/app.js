
import { pocket } from 'pocket/index'
import { patch } from 'superfine'
// import fetchCache from 'fetch-from-cache/index'

import * as facebook from './stores/facebook'
import * as facebookManual from './stores/facebookManual'
import * as lambda from './stores/lambda'
import * as prompt from './stores/prompt'

import Facebook from './views/facebook'
import Landing from './views/landing'
import Missing from './views/missing'
import Palette from './views/palette'

import Overview from './views/overview'
import Hashtags from './views/hashtags'
import Sources from './views/sources'

import * as subs from './subs'
import * as sources from './stores/sources'

/**
 *
 * Initialize
 *
 */

const node = document.getElementById('app')
const app = init => pocket(init, view => patch(node, view))

const dispatch = app({
  state: {
    lambda: lambda.state,
    facebookManual: facebookManual.state,

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
    '/sources': Sources

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

/**
 *
 * Google Translate
 * https://cloud.google.com/translate/docs/reference/rest/v2/translate
 *
 */

// const path = 'https://translation.googleapis.com/language/translate/v2'
// const key = 'AIzaSyB52WzBoQzBvxXBMmUCKQlH4zHp8TvcDzo'

// fetchCache({
//   path: `${path}?key=${key}`,
//   options: {
//     method: 'POST',
//     cache: 'force-cache',
//     body: JSON.stringify({
//       q: 'Hello',
//       target: 'es',
//       format: 'text',
//       source: 'en'
//     })
//   }
// })
//   .then(data => {
//     console.log(data)
//   })
//   .catch(error => {
//     console.log(error)
//   })
