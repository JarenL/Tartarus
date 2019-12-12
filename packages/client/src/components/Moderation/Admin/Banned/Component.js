import React from 'react';
import Empty from '../../../shared/Empty';
import TartarusContract from '../../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../../shared/LoadingIndicator/Spinner';
import ReactList from 'react-list';
import NotificationContainer from '../../../Notifications/Notification/Container';

const blocksInDay = 5760;

const adminBannedEvents = ['AdminBan', 'AdminUnban'];

class Banned extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adminBannedEvents: [],
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

  getAdminBannedActivity = async props => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    let startingBlock = await this.getActivityBlock();

    switch (props) {
      case 'AdminBan':
        return new Promise((resolve, reject) => {
          instance
            .AdminBan(
              {},
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, adminBan) => {
              resolve(...adminBan);
            });
        });

      case 'AdminUnban':
        return new Promise((resolve, reject) => {
          instance
            .AdminUnban(
              {},
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, adminUnban) => {
              resolve(...adminUnban);
            });
        });
      default:
        return;
    }
  };

  instantiateContract = async () => {
    let adminActivity = await Promise.all(
      adminBannedEvents.map(event => this.getAdminBannedActivity(event))
    );

    let removeNull = adminActivity.flat().filter(item => {
      return item !== undefined && item !== [];
    });

    this.setState({
      adminActivityEvents: removeNull,
      loading: false
    });
    console.log(adminActivity);
  };

  handleUnban = async () => {
    // const contract = require('truffle-contract');
    // const tartarus = contract(TartarusContract);
    // tartarus.setProvider(this.props.web3.currentProvider);
    // let accounts = await this.props.web3.eth.getAccounts();
    // let instance = await tartarus.at(this.props.event.address);
    // instance.adminUnban
    //   .sendTransaction(
    //     this.props.web3.utils.fromAscii(this.props.username),
    //     this.state.comment === null
    //       ? this.state.post.args.creator
    //       : this.state.comment.args.creator,
    //     this.state.comment === null
    //       ? this.props.event.args._forum
    //       : this.props.event.args._forumId,
    //     {
    //       from: accounts[0],
    //       gasPrice: 20000000000
    //     }
    //   )
    //   .then(result => {
    //     console.log(result);
    //     this.setState({
    //       reportLoading: false
    //     });
    //     this.props.reset('report');
    //   })
    //   .catch(error => {
    //     console.log('error');
    //     this.setState({
    //       reportLoading: false
    //     });
    //   });
  };

  renderItem(index, key) {
    return (
      <NotificationContainer
        key={key}
        event={this.state.adminEvents[index]}
        // web3={this.props.web3}
      />
    );
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.adminEvents || this.state.adminEvents.length === 0) {
      return <Empty />;
    } else {
      return (
        <ReactList
          itemRenderer={this.renderItem.bind(this)}
          length={this.state.adminEvents.length}
          type='simple'
        />
      );
    }
  }
}

export default Banned;
