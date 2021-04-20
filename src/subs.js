
const listener = addEventListener

/**
 * Ensure that gtm.js never affects load time performance.
 * @function gtm
 */

export const gtm = data => {
  if (PROD) {
    listener('load', () => {
      const script = document.createElement('script')

      script.id = 'gtm'
      script.src = 'https://googletagmanager.com/gtm.js?id=' + data.id

      document.body.appendChild(script)
    })
  }
}

/**
 * Ensure that Facebook SDK never affects load time performance.
 * @function fbsdk
 */

export const fbsdk = () => {
  listener('load', () => {
    const script = document.createElement('script')

    script.id = 'facebook-jssdk'
    script.src = 'https://connect.facebook.net/en_US/sdk.js'

    document.body.appendChild(script)
  })
}

/**
 * Simple session state persistence
 * @function persist
 */

export const persist = (state, dispatch) => {
  console.log(
    JSON.parse(sessionStorage.getItem('state'))
  )

  listener('DOMContentLoaded', () => {
    dispatch(state => {
      const data = sessionStorage.getItem('state')
      Object.assign(state.facebook, JSON.parse(data))

      return state.facebook
    })
  })

  listener('beforeunload', () => {
    if (state.persist.lock == null) {
      const data = {
        accounts: state.facebook.accounts,
        insights: state.facebook.insights,
        instagram: state.facebook.instagram
      }

      sessionStorage.setItem('state', JSON.stringify(data))
    }
  })
}
