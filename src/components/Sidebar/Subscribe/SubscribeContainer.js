import React, { Component } from 'react';
import { connect } from 'react-redux';
import SubscribeButton from './SubscribeButton';
import UnsubscribeButton from './UnsubscribeButton';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingBubble from '../../shared/LoadingIndicator/Bubble';
import { updateUserSubscriptions } from '../../../redux/actions/actions';

class SubscribeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forumExists: false,
      loading: true
    };
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  instantiateContract = () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.forums
          .call(this.props.forumName, {
            from: accounts[0],
            gasPrice: 20000000000
          })
          .then(forum => {
            if (forum[0] === '0x0') {
              this.setState({
                loading: false,
                forumExists: false
              });
            } else {
              this.setState({
                loading: false,
                forumExists: true
              });
            }
          });
      });
    });
  };

  subscribeHandler = () => {
    let newSubscriptionsArray = this.props.userSettings[
      this.props.username
    ].subscriptions.slice();
    newSubscriptionsArray.push({
      forumName: this.props.forumName
    });
    let payload = {
      username: this.props.username,
      subscriptions: newSubscriptionsArray
    };
    this.props.dispatch(updateUserSubscriptions(payload));
  };

  unsubscribeHandler = () => {
    let newSubscriptionsArray = this.props.userSettings[
      this.props.username
    ].subscriptions.slice();
    for (var i = 0; i < newSubscriptionsArray.length; i++) {
      if (newSubscriptionsArray[i].forumName === this.props.forumName) {
        newSubscriptionsArray.splice(i, 1);
      }
    }
    let payload = {
      username: this.props.username,
      subscriptions: newSubscriptionsArray
    };
    this.props.dispatch(updateUserSubscriptions(payload));
  };

  render() {
    if (this.state.loading) {
      return <LoadingBubble />;
    } else {
      if (this.state.forumExists) {
        var index = this.props.userSettings[
          this.props.username
        ].subscriptions.findIndex(
          forum => forum.forumName === this.props.forumName
        );
        if (index === -1) {
          return <SubscribeButton subscribeHandler={this.subscribeHandler} />;
        } else {
          return (
            <UnsubscribeButton unsubscribeHandler={this.unsubscribeHandler} />
          );
        }
      } else {
        return null;
      }
    }
  }
}

const mapStateToProps = state => {
  return {
    web3: state.web3,
    tartarusAddress: state.tartarus.tartarusAddress,
    userSettings: state.user.userSettings,
    username: state.user.username
  };
};

export default connect(mapStateToProps)(SubscribeContainer);
