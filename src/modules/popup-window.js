
// Function derived from:
// https://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen

export default (url, win, w, h) => {
  const y = win.outerHeight / 2 + win.screenY - (h / 2)
  const x = win.outerWidth / 2 + win.screenX - (w / 2)

  return win.open(url, '', `width=${w}, height=${h}, top=${y}, left=${x}`)
}
