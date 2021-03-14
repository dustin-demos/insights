
/**
 * Promise wrapper around Facebook FB.api
 * @function api
 */

export const api = (path, params) => new Promise(resolve => {
  FB.api(path, res => {
    resolve(res)
  }, params)
})

/**
 * Promise wrapper around Facebook FB.login
 * @function loginStatus
 */

export const loginStatus = params => new Promise(resolve => {
  FB.getLoginStatus(res => {
    resolve(res)
  }, params)
})

/**
 * Promise wrapper around Facebook FB.login
 * @function login
 */

export const login = params => new Promise(resolve => {
  FB.login(res => {
    resolve(res)
  }, params)
})

/**
 * Promise wrapper around Facebook FB.logout
 * @function logout
 */

export const logout = () => new Promise(resolve => {
  FB.logout(res => {
    resolve(res)
  })
})
