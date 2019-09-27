import React from 'react';
import Empty from '../../../shared/Empty';
import TartarusContract from '../../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../../shared/LoadingIndicator/Spinner';
import ReactList from 'react-list';
import ActivityItem from '../Activity/ActivityItem';

const blocksInDay = 5760;

class Banned extends React.Component {
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
          .ModeratorBan(
            {
              forum: forumBytes
            },
            {
              fromBlock: 0,
              toBlock: 'latest'
            }
          )
          .get((error, usersBanned) => {
            // console.log(usersBanned);
            instance
              .ModeratorUnban(
                {
                  forum: forumBytes
                },
                {
                  fromBlock: 0,
                  toBlock: 'latest'
                }
              )
              .get((error, usersUnbanned) => {
                let moderatorEventsArray = [].concat.apply(
                  [],
                  [usersBanned, usersUnbanned]
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

  handleUnban = () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.event.address).then(instance => {
        console.log(this.state);
        console.log(this.props);
        instance.moderatorBan
          .sendTransaction(
            this.props.web3.utils.fromAscii(this.props.username),
            this.state.comment === null
              ? this.state.post.args.creator
              : this.state.comment.args.creator,
            this.state.comment === null
              ? this.props.event.args.forum
              : this.props.event.args.forum,
            {
              from: accounts[0],
              gasPrice: 20000000000
            }
          )
          .then(result => {
            console.log(result);
            this.setState({
              reportLoading: false
            });
            this.props.reset('report');
          })
          .catch(error => {
            console.log('error');
            this.setState({
              reportLoading: false
            });
          });
      });
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

export default Banned;
