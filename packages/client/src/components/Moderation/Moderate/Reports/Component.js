import React from 'react';
import Empty from '../../../shared/Empty';
import TartarusContract from '../../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../../shared/LoadingIndicator/Spinner';
import ReactList from 'react-list';
import ReportContainer from './Report/Container';

const blocksInDay = 5760;

const moderatorReportEvents = ['ReportPost', 'ReportComment'];

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moderatorReportEvents: [],
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

  getModeratorReportActivity = async props => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    let startingBlock = await this.getActivityBlock();

    switch (props) {
      case 'ReportPost':
        return new Promise((resolve, reject) => {
          instance
            .ReportPost(
              {forum: this.props.forumName},
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, reportPost) => {
              resolve(...reportPost);
            });
        });

      case 'ReportComment':
        return new Promise((resolve, reject) => {
          instance
            .ReportComment(
              {forum: this.props.forumName},
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, reportComment) => {
              resolve(...reportComment);
            });
        });
      default:
        return;
    }
  };

  instantiateContract = async () => {
    let moderatorActivity = await Promise.all(
      moderatorReportEvents.map(event => this.getModeratorReportActivity(event))
    );

    let removeNull = moderatorActivity.flat().filter(item => {
      return item !== undefined && item !== [];
    });

    this.setState({
      moderatorReportEvents: removeNull,
      loading: false
    });
    console.log(moderatorActivity);
  };

  renderItem(index, key) {
    console.log(this.props.forumName);
    return (
      <ReportContainer
        key={key}
        event={this.state.moderatorReportEvents[index]}
      />
    );
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (
      !this.state.moderatorReportEvents ||
      this.state.moderatorReportEvents.length === 0
    ) {
      return <Empty />;
    } else {
      return (
        <ReactList
          itemRenderer={this.renderItem.bind(this)}
          length={this.state.moderatorReportEvents.length}
          type='simple'
        />
      );
    }
  }
}

export default Reports;
