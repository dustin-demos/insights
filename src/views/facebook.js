
const postMessage = (event, body) => {
  window.opener.postMessage({ event, body }, window.location.origin)
}

const Facebook = (state, dispatch) => {
  const click = () => {
    console.log('click')
    postMessage('login', state.router)
  }

  return (
    <div>
      <h1>Hello world!</h1>
      <button onclick={click}>Yes, link my account!</button>
    </div>
  )
}

export default {
  view: Facebook,
  onRoute: () => {
    window.addEventListener('beforeunload', () => {
      postMessage('close', null)
    })
  }
}
