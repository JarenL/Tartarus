import { TartarusContract, TartarusProxie } from 'tartarus-contract';

const getTartarusAddress = () => {
  return TartarusProxie.proxies['tartarus-contract/Tartarus'][
    TartarusProxie.proxies['tartarus-contract/Tartarus'].length - 1
  ].address;
};

const contract = require('truffle-contract');

const isAdmin = async (web3, user) => {
  const tartarus = contract(TartarusContract);
  tartarus.setProvider(web3.currentProvider);

  const tartarusInstance = await tartarus.at(this.props.tartarusAddress);
    tartarus.at(this.props.tartarusAddress).then(instance => {
      instance.isAdmin
        .call(this.props.web3.utils.fromAscii(this.props.username), {
          from: accounts[0],
          gasPrice: 20000000000
        })
}

const getAdmin = (web3, user) => {

}