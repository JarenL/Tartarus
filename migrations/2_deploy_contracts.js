var Tartarus = artifacts.require('./Tartarus.sol');

module.exports = function(deployer) {
  deployer.deploy(Tartarus, "0x6d6861656c")
};
