
import * as fb from './facebook'
import link from '../lib/routerLink'

/**
 *
 * Internal Actions
 *
 */

const error = state => {
  state.prompt.step = 0
  return state.prompt
}

const next = state => {
  state.prompt.step = state.prompt.step + 1
  return state.prompt
}

export const step = (state, data) => {
  state.prompt.step = data
  return { prompt: state.prompt }
}

/**
 *
 * Exported Actions
 *
 */

export const select = (state, data) => {
  state.prompt.accountID = data
  return state.prompt
}

export const continueWith = () => async dispatch => {
  await dispatch(fb.login)
  await dispatch(fb.me)

  dispatch(state => {
    const { login, me } = state.facebook
    dispatch(login.success && me.success ? confirmIdentity : error)
  })
}

export const confirmIdentity = () => async dispatch => {
  await dispatch(fb.accounts)

  dispatch(state => {
    const { accounts } = state.facebook
    dispatch(accounts.success ? next : error)
  })
}

export const confirmAccount = state => async dispatch => {
  await dispatch(fb.instagram, {
    id: state.prompt.accountID
  })

  dispatch(state => {
    const { instagram } = state.facebook
    dispatch(instagram.success ? next : error)
  })
}

export const letsGo = (state, data) => async dispatch => {
  await dispatch(fb.insights, {
    id: state.facebook.instagram.data.instagram_business_account.id
  })

  dispatch(state => {
    const { insights } = state.facebook

    if (insights.success === true) {
      // this might be janky
      // lots of refactoring should happen
      console.log('>>>', insights)
      data.callback(insights.data)
      // link({ to: '/insights' })
    } else {
      dispatch(error)
    }
  })
}

/**
 *
 * State
 *
 */

export const state = {
  step: 1,
  accountID: null
}
