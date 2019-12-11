import Web3 from 'web3';
import TartarusContract from '../../contracts/Tartarus.json';
import { connect } from 'react-redux';

const web3 = new Web3('wss://ropsten.infura.io/ws');

const watchNotifications = async props => {
  let events = [];

  const contract = require('truffle-contract');
  const tartarusContract = contract(TartarusContract);
  tartarusContract.setProvider(this.props.web3.currentProvider);
  let instance = await tartarusContract.at(this.props.tartarusAddress);
  let watchedPosts = props.userSettings.[this.props.username].watched.posts;
  let watchedComments = props.userSettings.[this.props.username].watched.comments;

  watchedComments.forEach(watchedComment => {
    events.push(
      instance.CommentCreated(
        { targetId: watchedComment.commentId },
        { fromBlock: 0, toBlock: 'latest' }
      )
    );
  });

  watchedPosts.forEach(watchedPost => {
    events.push(
      instance.CommentCreated(
        { targetId: watchedPost.postId },
        { fromBlock: 0, toBlock: 'latest' }
      )
    );
  });

  events.forEach(watchedEvent => {
    watchedEvent.watch(handleNotifications)
  })
};

const handleNotifications = (err, result) => {
  console.log(result);
}

const handleAddNotification = () => {

}

const handleRemoveNotification = () => {

}

function mapStateToProps(state) {
  return {
    tartarusAddress: state.tartarus.tartarusAddress,
    web3: state.web3,
    username: state.user.username,
    userSettings: state.userSettings.tartarusAddress
  };
}

export default connect(mapStateToProps)(watchNotifications);
