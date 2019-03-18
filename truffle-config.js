const path = require('path');
var HDWalletProvider = require('truffle-hdwallet-provider');

// const mnemonic = `${process.env.ETHEREUM_MNEMONIC}`;
// const api_key =  `${process.env.INFURA_API_KEY}`;

const mnemonic = "direct volume panda bike rather joy fever goat hammer ritual broccoli frame";


module.exports = {
  contracts_build_directory: path.join(__dirname, './src/contracts'),
  migrations_directory: './migrations',
  networks: {
    localhost: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*'
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/bdeb06c1bd2e4458aedfd3ada2fa4366"),
      network_id: 3,
      gas: 6000000,
      gasPrice: 5000000000,
      confirmations: 1 // # of confs to wait between deployments. (default: 0)
      // skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: '0.5.0' // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
  }
};
