
import app from './lib/pocket'

import * as facebook from './stores/facebook'
import * as prompt from './stores/prompt'

import Home from './views/home'
import Insights from './views/insights'
import Missing from './views/missing'

import * as subs from './subs'

app({
  state: {
    facebook: facebook.state,
    prompt: prompt.state,
    hashtags: {
      processed: null,
      data: null
    },
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
    '/insights': Insights,
    '/missing': Missing
  },
  mount: (state, dispatch) => {
    subs.gtm({ id: '' })
    subs.fbsdk()
    // subs.persist(state, dispatch)

    window.fbAsyncInit = async () => {
      FB.init({
        appId: '813793032539615',
        cookie: true,
        version: 'v10.0'
      })

      FB.AppEvents.logPageView()

      try {
        await dispatch(facebook.loginStatus)
        await dispatch(facebook.me)
      } catch (error) {
        console.log('Error >>> Login expired')
        dispatch(prompt.step, 1)
      }

      const { login, me } = state.facebook

      if (login.success && me.success) {
        dispatch(prompt.step, 2)
      }
    }
  }
})

// Google Tag Manager
window.dataLayer = window.dataLayer || []
window.dataLayer.push({
  'gtm.start': Date.now(),
  'event': 'gtm.js'
})
