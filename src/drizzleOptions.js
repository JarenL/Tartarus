import Tartarus from './../build/contracts/Tartarus.json'
import User from './../build/contracts/User.json'

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
  contracts: [
    Tartarus,
    User
  ],
  events: {
    // Tartarus: ['UserCreated', 'AdminCreated', 'ForumCreated'],
    User:  ['SubscribeForum', 'UnsubscribeForum', 'MessageSent', 'MessageReceived', 'CommentReceived', 'CommentCreated', 'PostCreated']
  },
  polls: {
    accounts: 5000,
    blocks: 1000
  }
}

export default drizzleOptions