
export const state = {
  flashbang: false,
  sidebar: true
}

export const toggle = (state, key) => {
  return { [key]: !state[key] }
}
