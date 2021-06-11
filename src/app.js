
import { pocket } from 'pocket/index'
import { patch } from 'superfine'

import * as facebook from './stores/facebook'
import * as prompt from './stores/prompt'

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
    landing: {
      index: 0,
      slides: [
        '/tmp/slide-0.png',
        '/tmp/slide-1.png'
      ]
    },

    activeTags: [],
    copyFlash: false,
    dropActive: null,

    overview: {
      chartRange: 24
    },
    hashtags: {
      comboMethod: 'reach',
      comboMethodName: 'Reach'
    },
    sources: {
      overlay: false, // Make a better system
      combinations: [],
      imports: [],
      posts: [],
      tags: []
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
  pages: {
    '/': Landing,
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
