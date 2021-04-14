
import * as fb from './facebookLib'

/**
 *
 * Utilities
 *
 */

const freeze = Object.freeze
const newState = (data, error, loading, success) => {
  return { data, error, loading, success }
}

const init = freeze(newState(null, null, null, null))
const loading = freeze(newState(null, null, true, null))

/**
 *
 * Internal actions and handlers
 *
 */

const setLoading = (state, key) => {
  const { facebook } = state
  facebook[key] = loading
  return { facebook }
}

// TODO: Fix the state param here
const setResponse = (state, data) => {
  const { facebook } = state
  const { key, response } = data

  facebook[key] = response.error
    ? newState(null, response.error, null, false)
    : newState(response, null, null, true)

  return { facebook }
}

/**
 *
 * Advanced requests
 *
 */

// TODO: Create some state when getting media ids
// TODO: Error handling
const getMedia = async data => {
  const res = await fb.api(`${data.id}/media${data.query}`)
  const paging = res.paging

  // TODO: Fix this mess of a condition
  if (paging && paging.cursors && paging.cursors.after) {
    return await getMedia({
      id: data.id,
      query: `?after=${res.paging.cursors.after}`,
      media: data.media.concat(res.data)
    })
  }

  return data.media
}

const postParams = {
  fields: 'caption,like_count,timestamp'
}

const insightParams = {
  fields: 'name,values',
  metric: 'engagement,impressions,reach,saved'
}

const hashtagRegexp = /#\w+/g

// TODO: Error handling? At least keep them in state?
// TODO: Clean this up a bit more
const getInsights = async data => {
  const media = await getMedia({
    id: data.id,
    query: '',
    media: []
  })

  const insights = []
  const promises = {}

  // make requests
  for (let i = media.length; i--;) {
    const id = media[i].id

    promises[id] = {
      post: fb.api(`${id}`, postParams),
      insights: fb.api(`${id}/insights`, insightParams)
    }
  }

  // format data
  for (const key in promises) {
    const postRes = await promises[key].post
    const insightsRes = await promises[key].insights

    // put all data here
    const post = {}

    // skip errors
    if (postRes.error) {
      // do nothing
    } else {
      // simplify stats from post
      Object.assign(post, {
        id: postRes.id,
        caption: postRes.caption,
        likes: postRes.like_count,
        tags: postRes.caption.match(hashtagRegexp)
      })
    }

    // skip errors
    if (insightsRes.error) {
      // do nothing
    } else {
      // simplify stats from insights
      for (let i = insightsRes.data.length; i--;) {
        const stat = insightsRes.data[i]
        // post.id = key
        post[stat.name] = stat.values[0].value
      }
    }

    // console.log(post)

    // push
    insights.push(post)
  }

  return insights
}

/**
 *
 * Actions
 *
 */

const scope = 'instagram_basic,instagram_manage_insights,pages_read_engagement'
const loginParams = { scope }

export const login = () => async dispatch => {
  dispatch(setLoading, 'login')
  dispatch(setResponse, {
    key: 'login',
    response: await fb.login(loginParams)
  })
}

export const loginStatus = () => async dispatch => {
  dispatch(setLoading, 'login')
  dispatch(setResponse, {
    key: 'login',
    response: await fb.loginStatus()
  })
}

// TODO: This could be better
export const logout = () => async () => {
  const response = await fb.logout()
  if (response.error == null) {
    location.reload()
  }
}

export const me = () => async dispatch => {
  dispatch(setLoading, 'me')
  dispatch(setResponse, {
    key: 'me',
    response: await fb.api('me/?fields=first_name,picture')
  })
}

export const accounts = () => async dispatch => {
  dispatch(setLoading, 'accounts')
  dispatch(setResponse, {
    key: 'accounts',
    response: await fb.api('me/accounts/?fields=category_list,name')
  })
}

export const instagram = (x, data) => async dispatch => {
  dispatch(setLoading, 'instagram')
  dispatch(setResponse, {
    key: 'instagram',
    response: await fb.api(`${data.id}?fields=instagram_business_account`)
  })
}

export const insights = (x, data) => async dispatch => {
  dispatch(setLoading, 'insights')
  dispatch(setResponse, {
    key: 'insights',
    response: await getInsights(data)
  })
}

/**
 *
 * State
 *
 */

export const state = {
  accounts: init,
  insights: init,
  instagram: init,
  login: init,
  me: init
}
