const IPFS = require('ipfs-http-client');
const state = require('./state');

const { urlToProviderObject, noProvider } = require('./util');

const setProvider = provider => {
  // if (!provider) throw Error(`No provider argument passed to ipfs.setProvider. Try something like 'https://infura.io:5001'.`)
  provider = urlToProviderObject(provider);
  state.ipfs = new IPFS(provider);
};

// use this to call the ipfs methods directly
const getIpfs = () => state.ipfs;

export { setProvider, getIpfs };
