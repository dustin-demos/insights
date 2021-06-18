
import { encode } from 'pocket/router/query'
import popup from 'popup-window'

/**
 *
 * Constants
 *
 */

const FB_DIALOG_URL = 'https://m.facebook.com/v11.0/dialog/oauth'
const FB_CLIENT_ID = '813793032539615'
const FB_REDIRECT_URL = 'https://a6bd263df61b.ngrok.io/fb'

/**
 *
 * Actions
 *
 */

export const openDialog = ({ facebookManual }) => {
  const url = FB_DIALOG_URL + encode({
    client_id: FB_CLIENT_ID,
    redirect_uri: FB_REDIRECT_URL,
    state: '123'
  })

  facebookManual.dialog = popup(url, window, 448 + 20, 44 + 488)
  facebookManual.popup = true

  return { facebookManual }
}

export const cancelDialog = ({ facebookManual }) => {
  facebookManual.dialog.close()
  facebookManual.popup = false

  return { facebookManual }
}

const handlers = {
  login: ({ facebookManual }, data) => {
    console.log('hi')
    facebookManual.message = data.body
    return { facebookManual }
  },
  close: cancelDialog
}

export const handleMessage = (state, data) => {
  return handlers[data.event](state, data)
}

/**
 *
 * State
 *
 */

export const state = {
  dialog: null,
  message: null,
  popup: false
}
