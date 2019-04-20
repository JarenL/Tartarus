import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';
import SubscriptionHeader from './SubscriptionHeader.js';
import SubscriptionList from './SubscriptionList.js';
import { updateUserSubscriptions } from '../../../redux/actions/actions';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

class SubscriptionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSubscriptions: true,
      editSubscriptions: false
    };
  }

  toggleShowSubscriptions = () => {
    this.setState({ showSubscriptions: !this.state.showSubscriptions });
  };

  toggleEditSubscriptions = () => {
    this.setState({ editSubscriptions: !this.state.editSubscriptions });
    console.log('edit');
  };

  handleRemoveSubscription = props => {
    console.log('remove');
    console.log(props);
    let newSubscriptionsArray = this.props.userSettings[
      this.props.username
    ].subscriptions.slice();
    for (var i = 0; i < newSubscriptionsArray.length; i++) {
      if (newSubscriptionsArray[i].address === props) {
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
    if (this.props.username !== null) {
      return (
        <Wrapper>
          <SubscriptionHeader
            showSubscriptions={this.state.showSubscriptions}
            toggleShowSubscriptions={this.toggleShowSubscriptions}
            toggleEditSubscriptions={this.toggleEditSubscriptions}
          />
          {this.state.showSubscriptions && (
            <SubscriptionList
              username={this.props.username}
              userSettings={this.props.userSettings}
              editSubscriptions={this.state.editSubscriptions}
              handleRemoveSubscription={this.handleRemoveSubscription}
            />
          )}
        </Wrapper>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state) {
  return {
    userSettings: state.user.userSettings,
    username: state.user.username
  };
}

export default connect(mapStateToProps)(SubscriptionContainer);
