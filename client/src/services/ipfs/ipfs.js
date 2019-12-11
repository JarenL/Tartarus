const IPFS = require('ipfs-http-client');
// const ipfs = new IPFS({
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https'
// });

//removing https fixed loading (???)

const ipfs = new IPFS({
  host: 'ipfs.infura.io',
  port: 5001
});

//run with local daemon
// const ipfsApi = require(‘ipfs-api’);
// const ipfs = new ipfsApi(‘localhost’, ‘5001’, {protocol:‘http’});
export default ipfs;
