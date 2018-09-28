import Tartarus from './../build/contracts/ComplexStorage.json'

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
  contracts: [
    Tartarus
  ],
  events: {
    Tartarus: ['UserCreated', 'AdminCreated', 'ForumCreated']
  },
  polls: {
    accounts: 5000,
    blocks: 1000
  }
}

export default drizzleOptions