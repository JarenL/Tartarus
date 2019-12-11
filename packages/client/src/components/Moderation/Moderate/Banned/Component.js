import React from 'react';
import Empty from '../../../shared/Empty';
import TartarusContract from '../../../../contracts/Tartarus.json.js';
import LoadingIndicatorSpinner from '../../../shared/LoadingIndicator/Spinner';
import ReactList from 'react-list';
import NotificationContainer from '../../../Notifications/Notification/Container';

const blocksInDay = 5760;

const moderatorBannedEvents = ['AdminBan', 'AdminUnban'];

class Banned extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moderatorBannedEvents: [],
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

  getModeratorBannedActivity = async props => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    let startingBlock = await this.getActivityBlock();

    switch (props) {
      case 'ModeratorBan':
        return new Promise((resolve, reject) => {
          instance
            .ModeratorBan(
              {},
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
              {},
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, moderatorUnban) => {
              resolve(...moderatorUnban);
            });
        });
      default:
        return;
    }
  };

  instantiateContract = async () => {
    let moderatorActivity = await Promise.all(
      moderatorBannedEvents.map(event => this.getModeratorBannedActivity(event))
    );

    let removeNull = moderatorActivity.flat().filter(item => {
      return item !== undefined && item !== [];
    });

    this.setState({
      moderatorBannedEvents: removeNull,
      loading: false
    });
    console.log(moderatorActivity);
  };

  handleUnban = () => {
    // const contract = require('truffle-contract');
    // const tartarus = contract(TartarusContract);
    // tartarus.setProvider(this.props.web3.currentProvider);
    // this.props.web3.eth.getAccounts((error, accounts) => {
    //   tartarus.at(this.props.event.address).then(instance => {
    //     console.log(this.state);
    //     console.log(this.props);
    //     instance.moderatorBan
    //       .sendTransaction(
    //         this.props.web3.utils.fromAscii(this.props.username),
    //         this.state.comment === null
    //           ? this.state.post.args.creator
    //           : this.state.comment.args.creator,
    //         this.state.comment === null
    //           ? this.props.event.args.forum
    //           : this.props.event.args.forum,
    //         {
    //           from: accounts[0],
    //           gasPrice: 20000000000
    //         }
    //       )
    //       .then(result => {
    //         console.log(result);
    //         this.setState({
    //           reportLoading: false
    //         });
    //         this.props.reset('report');
    //       })
    //       .catch(error => {
    //         console.log('error');
    //         this.setState({
    //           reportLoading: false
    //         });
    //       });
    //   });
    // });
  };

  renderItem(index, key) {
    console.log(this.props.forumName);
    return (
      <NotificationContainer
        key={key}
        event={this.state.moderatorBannedEvents[index]}
      />
    );
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (
      !this.state.moderatorBannedEvents ||
      this.state.moderatorBannedEvents.length === 0
    ) {
      return <Empty />;
    } else {
      return (
        <ReactList
          itemRenderer={this.renderItem.bind(this)}
          length={this.state.moderatorBannedEvents.length}
          type='simple'
        />
      );
    }
  }
}

export default Banned;
