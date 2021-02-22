import React from 'react';
import Empty from '../../shared/Empty';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner';
import ReactList from 'react-list';
import ReportContainer from './Report/Container';

const blocksInDay = 5760;

const adminReportEvents = ['ReportAdmin'];

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adminReportEvents: [],
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

  getAdminReportActivity = async props => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    let startingBlock = await this.getActivityBlock();

    switch (props) {
      case 'ReportAdmin':
        return new Promise((resolve, reject) => {
          instance
            .ReportAdmin(
              {},
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, reportAdmin) => {
              resolve(...reportAdmin);
            });
        });
      default:
        return;
    }
  };

  instantiateContract = async () => {
    let adminActivity = await Promise.all(
      adminReportEvents.map(event => this.getAdminReportActivity(event))
    );

    let removeNull = adminActivity.flat().filter(item => {
      return item !== undefined && item !== [];
    });

    this.setState({
      adminReportEvents: removeNull,
      loading: false
    });
    console.log(adminActivity);
  };

  renderItem(index, key) {
    console.log(this.props.forumName);
    return (
      <ReportContainer key={key} event={this.state.adminReportEvents[index]} />
    );
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (
      !this.state.adminReportEvents ||
      this.state.adminReportEvents.length === 0
    ) {
      return <Empty />;
    } else {
      return (
        <ReactList
          itemRenderer={this.renderItem.bind(this)}
          length={this.state.adminReportEvents.length}
          type='simple'
        />
      );
    }
  }
}

export default Reports;
