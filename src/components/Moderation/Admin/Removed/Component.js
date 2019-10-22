import React from 'react';
import Empty from '../../shared/Empty';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner';
import ReactList from 'react-list';
import NotificationContainer from '../../../Notifications/Notification/Container';

const blocksInDay = 5760;

const moderatorRemovedEvents = ['PostRemoved', 'CommentRemoved'];

class Removed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moderatorRemovedEvents: [],
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  getActivityBlock = async () => {
    const latest = await this.props.web3.eth.getBlock('latest');
    switch (this.props.time) {
      case 'day':
        return latest.number - 1 * blocksInDay;
      case 'week':
        return latest.number - 7 * blocksInDay;
      case 'month':
        return latest.number - 30 * blocksInDay;
      case 'year':
        return latest.number - 365 * blocksInDay;
      case 'all':
        return 0;
      default:
        return 0;
    }
  };

  getRemovedActivity = async props => {
    let removedActivity = await Promise.all(
      moderatorRemovedEvents.map(event => this.getRemoved(event))
    );
    // resolve(...removedActivity);
    return removedActivity;
  };

  getRemoved = async props => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    let startingBlock = await this.getActivityBlock();
    const forumBytes = this.props.web3.utils.fromAscii(this.props.forumName);

    switch (props) {
      case 'PostRemoved':
        return new Promise((resolve, reject) => {
          instance
            .PostRemoved(
              { forum: forumBytes, user: props },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, postRemoved) => {
              console.log(postRemoved);
              resolve(...postRemoved);
            });
        });
      case 'CommentRemoved':
        return new Promise((resolve, reject) => {
          instance
            .CommentRemoved(
              { forum: forumBytes, user: props },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, commentRemoved) => {
              console.log(commentRemoved);
              resolve(...commentRemoved);
            });
        });
      default:
        return;
    }
  };

  instantiateContract = async () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    const forumBytes = this.props.web3.utils.fromAscii(this.props.forumName);
    tartarus.setProvider(this.props.web3.currentProvider);
    const instance = await tartarus.at(this.props.tartarusAddress);
    const moderators = await instance.getModerators(forumBytes).call();
    let moderatorRemovedActivity = await Promise.all(
      moderators.map(moderator => this.getRemovedActivity(moderator))
    );

    let removeNull = moderatorRemovedActivity.flat().filter(item => {
      return item !== undefined && item !== [];
    });

    removeNull.sort((a, b) => (b.args.time.c[0] > a.args.time.c[0] ? 1 : -1));
    this.setState({
      moderatorRemovedEvents: removeNull,
      loading: false
    });
  };

  renderItem(index, key) {
    console.log(this.props.forumName);
    return (
      <NotificationContainer
        key={key}
        forumName={this.props.forumName}
        event={this.state.moderatorRemovedEvents[index]}
        removable={false}
      />
    );
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (
      !this.state.moderatorRemovedEvents ||
      this.state.moderatorRemovedEvents.length === 0
    ) {
      return <Empty />;
    } else {
      return (
        <ReactList
          itemRenderer={this.renderItem.bind(this)}
          length={this.state.moderatorRemovedEvents.length}
          type='simple'
        />
      );
    }
  }
}

export default Removed;
