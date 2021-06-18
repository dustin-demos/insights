
import * as facebookManual from '../stores/facebookManual'

export const dialogListener = () => {
  let listener = null

  const handler = dispatch => event => {
    dispatch(facebookManual.handleMessage, event.data)
  }

  return {
    add: dispatch => {
      listener = handler(dispatch)
      window.addEventListener('message', listener)
    },
    remove: () => {
      window.removeEventListener('message', listener)
    }
  }
}
