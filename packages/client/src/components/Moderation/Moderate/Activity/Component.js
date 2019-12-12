import React from 'react';
import Empty from '../../../shared/Empty';
import TartarusContract from '../../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../../shared/LoadingIndicator/Spinner';
import ReactList from 'react-list';
import NotificationContainer from '../../../Notifications/Notification/Container';

const blocksInDay = 5760;

const moderatorActivityEvents = [
  'ForumCreated',
  'ForumLocked',
  'ForumUpdated',
  'ModeratorBan',
  'ModeratorUnban',
  'ModeratorCreated',
  'ModeratorPaid',
  'ModeratorRemoved',
  'ModeratorUpdated'
];

class Activity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moderators: [],
      moderatorActivityEvents: [],
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

  getModeratorActivity = async props => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    const instance = await tartarus.at(this.props.tartarusAddress);
    const startingBlock = await this.getActivityBlock();
    const forumBytes = this.props.web3.utils.fromAscii(this.props.forumName);

    switch (props) {
      case 'ForumCreated':
        return new Promise((resolve, reject) => {
          instance
            .ForumCreated(
              { forum: forumBytes },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, forumCreated) => {
              console.log(forumCreated);
              resolve(...forumCreated);
            });
        });
      case 'ForumLocked':
        return new Promise((resolve, reject) => {
          instance
            .ForumLocked(
              { forum: forumBytes },

              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, forumLocked) => {
              resolve(...forumLocked);
            });
        });

      case 'ForumUpdated':
        return new Promise((resolve, reject) => {
          instance
            .ForumUpdated(
              { forum: forumBytes },

              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, forumUpdated) => {
              resolve(...forumUpdated);
            });
        });
      case 'ModeratorBan':
        return new Promise((resolve, reject) => {
          instance
            .ModeratorBan(
              { forum: forumBytes },

              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, moderatorBan) => {
              resolve(...moderatorBan);
            });
        });

      case 'ModeratorUnban':
        return new Promise((resolve, reject) => {
          instance
            .ModeratorUnban(
              { forum: forumBytes },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, moderatorUnban) => {
              resolve(...moderatorUnban);
            });
        });
      case 'ModeratorCreated':
        return new Promise((resolve, reject) => {
          instance
            .ModeratorCreated(
              { forum: forumBytes },

              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, moderatorCreated) => {
              resolve(...moderatorCreated);
            });
        });
      case 'ModeratorPaid':
        return new Promise((resolve, reject) => {
          instance
            .ModeratorPaid(
              { forum: forumBytes },

              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, moderatorPaid) => {
              resolve(...moderatorPaid);
            });
        });
      case 'ModeratorRemoved':
        return new Promise((resolve, reject) => {
          instance
            .ModeratorRemoved(
              { forum: forumBytes },

              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, moderatorRemoved) => {
              resolve(...moderatorRemoved);
            });
        });
      case 'ModeratorUpdated':
        return new Promise((resolve, reject) => {
          instance
            .ModeratorUpdated(
              { forum: forumBytes },

              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, moderatorUpdated) => {
              resolve(...moderatorUpdated);
            });
        });
      default:
        return;
    }
  };

  instantiateContract = async () => {
    let moderatorActivity = await Promise.all(
      moderatorActivityEvents.map(event => this.getModeratorActivity(event))
    );

    let removeNull = moderatorActivity.flat().filter(item => {
      return item !== undefined && item !== [];
    });

    removeNull.sort((a, b) => (a.args.time < b.args.time ? 1 : -1));

    this.setState({
      moderatorActivityEvents: removeNull,
      loading: false
    });
    console.log(moderatorActivity);
  };

  renderItem(index, key) {
    return (
      <NotificationContainer
        key={key}
        event={this.state.moderatorActivityEvents[index]}
        removable={false}
      />
    );
  }

  render() {
    console.log(this.state.moderatorActivityEvents);
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (
      !this.state.moderatorActivityEvents ||
      this.state.moderatorActivityEvents.length === 0
    ) {
      return <Empty />;
    } else {
      return (
        <ReactList
          itemRenderer={this.renderItem.bind(this)}
          length={this.state.moderatorActivityEvents.length}
          type='simple'
        />
      );
    }
  }
}

export default Activity;
