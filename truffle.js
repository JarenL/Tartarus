const path = require("path");
var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "direct volume panda bike rather joy fever goat hammer ritual broccoli frame";

module.exports = {
  contracts_build_directory: path.join(__dirname, "./src/contracts"),
  migrations_directory: "./migrations",
  networks: {
    localhost: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/bdeb06c1bd2e4458aedfd3ada2fa4366")
      },
      network_id: 3
    } 
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
};
