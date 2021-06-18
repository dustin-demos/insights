
// Function derived from:
// https://github.com/dcousens/fisher-yates/blob/master/index.js
// https://github.com/sindresorhus/array-shuffle/blob/main/index.js

export default array => {
  let tmp

  for (let i = array.length; i--;) {
    const index = Math.floor(Math.random() * (i + 1))

    if (i === index) {
      continue
    }

    tmp = array[i]
    array[i] = array[index]
    array[index] = tmp
  }

  return array
}
