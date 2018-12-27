const ipfs = require('./ipfs')
// const utils = require('./utils')

const init = async () => {
  ipfs.setProvider('https://ipfs.infura.io:5001')
}

export {
  // ipfs
  init,
  ipfs
  // utils
  // utils
}
