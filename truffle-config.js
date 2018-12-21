const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "../client/src/contracts"),
  migrations_directory: "./migrations",
  networks: {
    localhost: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
    ropsten: {
      host: "localhost",
      port: 8545,
      network_id: "3",
      gas: 6721975,
      from: "0x6c7a0FE0AFAc046B2fA87D4BF4288feE045878C7"
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
};
