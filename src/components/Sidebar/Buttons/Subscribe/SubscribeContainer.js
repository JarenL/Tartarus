import React, { Component } from 'react';
import { connect } from 'react-redux';
import SubscribeButton from './SubscribeButton';
import UnsubscribeButton from './UnsubscribeButton';

class SubscribeContainer extends Component {
  render() {
    var index = this.props.userSettings[
      this.props.userAddress
    ].subscriptions.findIndex(
      forum => forum.address === this.props.forumAddress
    );
    if (index === -1) {
      return <SubscribeButton forumContext={this.props.forumAddress} />;
    } else {
      return <UnsubscribeButton forumContext={this.props.forumAddress} />;
    }
  }
}

const mapStateToProps = state => {
  return {
    userSettings: state.user.userSettings,
    userAddress: state.user.userAddress
  };
};

export default connect(mapStateToProps)(SubscribeContainer);
