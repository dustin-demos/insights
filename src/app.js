
import app from './lib/pocket'

import * as facebook from './stores/facebook'
import * as prompt from './stores/prompt'

import Home from './views/home'
import Missing from './views/missing'

import Overview from './views/overview'
import Insights from './views/insights'
import Sources from './views/sources'

// import Discover from './views/discover'
// import Statistics from './views/statistics'
// import Suggested from './views/suggested'

import * as subs from './subs'
import * as sources from './stores/sources'

app({
  state: {
    overview: {
      chartRange: 48,
      menuOpen: false, // range menu
      menu: ''
    },
    sources: {
      combinations: {},
      imports: [],
      tags: []
    },

    facebook: facebook.state,
    prompt: prompt.state,

    footer: {
      year: new Date().getFullYear()
    },
    interface: {
      activeTab: 'stats'
    },
    persist: {
      lock: null
    }
  },
  pages: {
    '/': Home,
    '/missing': Missing,

    '/overview': Overview,
    '/insights': Insights,
    '/sources': Sources

    // '/discover': Discover,
    // '/suggested': Suggested,
  },
  onstart: dispatch => {
    subs.gtm({ id: '' })
    subs.fbsdk()

    // dispatch(state => {
    //   subs.persist(state, dispatch)
    // })

    window.fbAsyncInit = async () => {
      FB.init({
        appId: '813793032539615',
        cookie: true,
        version: 'v10.0'
      })

      FB.AppEvents.logPageView()

      // try {
      //   await dispatch(facebook.loginStatus)
      //   await dispatch(facebook.me)
      // } catch (error) {
      //   console.log('Error >>> Login expired')
      //   dispatch(prompt.step, 1)
      // }

      // dispatch(state => {
      //   const { login, me } = state.facebook
      //
      //   if (login.success && me.success) {
      //     dispatch(prompt.step, 2)
      //   }
      // })
    }

    dispatch(sources.restoreImports)
  }
})

// Google Tag Manager
window.dataLayer = window.dataLayer || []
window.dataLayer.push({
  'gtm.start': Date.now(),
  'event': 'gtm.js'
})
