
const postMessage = (type, body) => {
  window.opener.postMessage({ type, body }, window.location.origin)
}

const Facebook = (state, dispatch) => {
  const click = () => {
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
