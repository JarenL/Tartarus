import React from 'react';
import Empty from '../../../shared/Empty';
import TartarusContract from '../../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../../shared/LoadingIndicator/Spinner';
import ReactList from 'react-list';
import ActivityItem from '../Activity/ActivityItem';

const blocksInDay = 5760;

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moderatorEvents: [],
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  instantiateContract = () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    const forumBytes = this.props.web3.utils.fromAscii(this.props.forumName);
    tartarus.setProvider(this.props.web3.currentProvider);
    tartarus
      .at(this.props.tartarusAddress)
      .then(instance => {
        instance
          .ReportPost(
            {
              _forum: forumBytes
            },
            {
              fromBlock: 0,
              toBlock: 'latest'
            }
          )
          .get((error, postsReported) => {
            // console.log(usersBanned);
            instance
              .ReportComment(
                {
                  forum: forumBytes
                },
                {
                  fromBlock: 0,
                  toBlock: 'latest'
                }
              )
              .get((error, commentsReported) => {
                let moderatorEventsArray = [].concat.apply(
                  [],
                  [postsReported, commentsReported]
                );
                console.log(moderatorEventsArray);
                moderatorEventsArray.sort((a, b) =>
                  b.args.time.c[0] > a.args.time.c[0] ? 1 : -1
                );
                this.setState({
                  moderatorEvents: moderatorEventsArray,
                  loading: false
                });
              });
          });
      })
      .catch(err => {
        console.log('error');
      });
  };

  renderItem(index, key) {
    console.log(this.props.forumName);
    return (
      <ActivityItem
        key={key}
        forumName={this.props.forumName}
        event={this.state.moderatorEvents[index]}
        web3={this.props.web3}
        username={this.props.username}
      />
    );
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.moderatorEvents || this.state.moderatorEvents.length === 0) {
      return <Empty />;
    } else {
      return (
        <ReactList
          itemRenderer={this.renderItem.bind(this)}
          length={this.state.moderatorEvents.length}
          type='simple'
        />
      );
    }
  }
}

export default Reports;
