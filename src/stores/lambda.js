
/**
 *
 * Utilities
 *
 */

const newState = (data, error, loading, success) =>
  Object.freeze({ data, error, loading, success })

const init = newState(null, null, null, null)
const loading = newState(null, null, true, null)

/**
 *
 * Internal actions
 *
 */

const setLoading = ({ lambda }, key) => {
  lambda[key] = loading
  return { lambda }
}

// how does netlify deal wtih errors?
// figure that out
const setResponse = ({ lambda }, { key, data }) => {
  lambda[key] = data.error
    ? newState(null, data.error, null, false)
    : newState(data, null, null, true)

  return { lambda }
}

/**
 *
 * Exported actions
 *
 */

export const combinations = (state, data) => dispatch => {
  dispatch(setLoading, 'combinations')

  const options = {
    method: 'POST',
    body: JSON.stringify({
      data: data.data,
      key: data.key
    })
  }

  fetch('/.netlify/functions/combinations', options)
    .then(res => res.json())
    .then(data => {
      dispatch(setResponse, { key: 'combinations', data: data.data })
    })
    .catch(error => {
      console.log('Error', '>>', error.message, error)
    })
}

export const helloWorld = (state, data) => dispatch => {
  dispatch(setLoading, 'hello-world')

  fetch('/.netlify/functions/hello-world')
    .then(res => res.json())
    .then(data => {
      dispatch(setResponse, { key: 'hello-world', data })
    })
    .catch(error => {
      console.log('Fetch Error', '>>', error.message, error)
    })
}

/**
 *
 * State
 *
 */

export const state = {
  'combinations': init,
  'hello-world': init
}
