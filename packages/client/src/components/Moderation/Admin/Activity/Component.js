import React from 'react';
import Empty from '../../../shared/Empty';
import TartarusContract from '../../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../../shared/LoadingIndicator/Spinner';
import ReactList from 'react-list';
import NotificationContainer from '../../../Notifications/Notification/Container';

const blocksInDay = 5760;

const adminActivityEvents = [
  'AdminCreated',
  'AdminUpdated',
  'AdminRemoved',
  'AdminPaid',
  'AdminBan',
  'AdminUnban'
];

class Activity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admins: [],
      adminActivityEvents: [],
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

  getAdminActivity = async props => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    let startingBlock = await this.getActivityBlock();

    switch (props) {
      case 'AdminCreated':
        return new Promise((resolve, reject) => {
          instance
            .AdminCreated(
              {},
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, adminCreated) => {
              console.log(adminCreated);
              resolve(...adminCreated);
            });
        });
      case 'AdminUpdated':
        return new Promise((resolve, reject) => {
          instance
            .AdminUpdated(
              {},
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, adminCreated) => {
              resolve(...adminCreated);
            });
        });

      case 'AdminRemoved':
        return new Promise((resolve, reject) => {
          instance
            .AdminRemoved(
              {},
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, adminRemoved) => {
              resolve(...adminRemoved);
            });
        });
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
      case 'AdminPaid':
        return new Promise((resolve, reject) => {
          instance
            .AdminPaid(
              {},
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, adminPaid) => {
              resolve(...adminPaid);
            });
        });
      default:
        return;
    }
  };

  instantiateContract = async () => {
    let adminActivity = await Promise.all(
      adminActivityEvents.map(event => this.getAdminActivity(event))
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

  renderItem(index, key) {
    return (
      <NotificationContainer
        key={key}
        event={this.state.adminActivityEvents[index]}
        removable={false}
      />
    );
  }

  render() {
    console.log(this.state.adminActivityEvents);
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (
      !this.state.adminActivityEvents ||
      this.state.adminActivityEvents.length === 0
    ) {
      return <Empty />;
    } else {
      return (
        <ReactList
          itemRenderer={this.renderItem.bind(this)}
          length={this.state.adminActivityEvents.length}
          type='simple'
        />
      );
    }
  }
}

export default Activity;
