
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
const digestMessage = async message => {
  const msgUint8 = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const responseHandler = obj => async res => {
  // const date = res.headers.get('date')
  // const time = date ? new Date(date).getTime() : 0
  // const threshold = Date.now() - 1800000

  console.log(obj.path, res)

  const message = JSON.stringify(obj)
  const foo = await digestMessage(message)

  console.log(foo)

  // if (time > threshold) {
  //   const json = await res.json()
  //   window.localStorage.setItem(hash, json)
  //   return json
  // } else {
  //   return window.localStorage.getItem(hash)
  // }
}

const errorHandler = error => {
  console.log(error)
}

export default data =>
  window.fetch(data.path, data.options)
    .then(responseHandler(data))
    .catch(errorHandler)
