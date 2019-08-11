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
      adminEvents: [],
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  instantiateContract = async () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    instance
      .AdminBan({
        fromBlock: 0,
        toBlock: 'latest'
      })
      .get((error, usersBanned) => {
        // console.log(usersBanned);
        instance
          .AdminUnban({
            fromBlock: 0,
            toBlock: 'latest'
          })
          .get((error, usersUnbanned) => {
            let adminEventsArray = [].concat.apply(
              [],
              [usersBanned, usersUnbanned]
            );
            console.log(adminEventsArray);
            adminEventsArray.sort((a, b) =>
              b.args.time.c[0] > a.args.time.c[0] ? 1 : -1
            );
            this.setState({
              adminEvents: adminEventsArray,
              loading: false
            });
          });
      });
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
      <ActivityItem
        key={key}
        event={this.state.adminEvents[index]}
        web3={this.props.web3}
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
