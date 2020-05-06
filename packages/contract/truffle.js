const path = require('path');
const HDWalletProvider = require('truffle-hdwallet-provider');
require('dotenv').config();

module.exports = {
  contracts_build_directory: path.join(__dirname, './build/contracts'),
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          'https://ropsten.infura.io/v3/' + process.env.INFURA_API_KEY
        );
      },
      network_id: 3,
      gas: 8000000,
      gasPrice: 10000000000
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          'https://kovan.infura.io/v3/' + process.env.INFURA_API_KEY
        );
      },
      network_id: 42,
      gas: 4465030,
      gasPrice: 10000000000
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNENOMIC,
          'https://rinkeby.infura.io/v3/' + process.env.INFURA_API_KEY
        ),
      network_id: 4,
      gas: 3000000,
      gasPrice: 10000000000
    },
    // main ethereum network(mainnet)
    main: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNENOMIC,
          'https://mainnet.infura.io/v3/' + process.env.INFURA_API_KEY
        ),
      network_id: 1,
      gas: 3000000,
      gasPrice: 10000000000
    }
  },
  compilers: {
    solc: {
      version: '0.5.2', // ex:  "0.4.20". (Default: Truffle's installed solc)
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
