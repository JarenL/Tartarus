import React, { Component } from 'react';
import Button from '../../../shared/Button';
import styled from 'styled-components/macro';
import { connect } from 'react-redux';
import { updateUserSubscriptions } from '../../../../redux/actions/actions';
import ForumContract from '../../../../contracts/Forum.json';
import LoadingBubble from '../../../shared/LoadingIndicator/Bubble';

const Subscribe = styled(Button)`
  border-radius: 2px 2px 0 0;
  padding: 16px;
  text-decoration: none;
  text-align: center;
`;

class SubscribeButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  subscribeHandler = () => {
    this.setState({
      loading: true
    });
    const contract = require('truffle-contract');
    const forum = contract(ForumContract);
    forum.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      forum.at(this.props.forumContext).then(instance => {
        instance.name
          .call({
            from: accounts[0],
            gasPrice: 20000000000
          })
          .then(result => {
            let newSubscriptionsArray = this.props.userSettings[
              this.props.userAddress
            ].subscriptions.slice();
            newSubscriptionsArray.push({
              address: this.props.forumContext,
              name: this.props.web3.utils.hexToAscii(result)
            });
            let payload = {
              user: this.props.userAddress,
              subscriptions: newSubscriptionsArray
            };
            this.props.dispatch(updateUserSubscriptions(payload));
            this.setState({
              loading: false
            });
          });
      });
    });
  };

  render() {
    if (this.state.loading) {
      return <LoadingBubble />
    } else {
      return (
        <Subscribe onClick={() => this.subscribeHandler(this.props)}>
          Subscrbe
        </Subscribe>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    userSettings: state.user.userSettings,
    userAddress: state.user.userAddress
  };
}

export default connect(mapStateToProps)(SubscribeButton);
