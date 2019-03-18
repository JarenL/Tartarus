import React, { Component } from 'react';
import { connect } from 'react-redux';
import SidebarSubscribeButton from './SubscribeButton';
import SidebarUnsubscribeButton from './UnsubscribeButton';

class SideBarSubscribeContainer extends Component {
  render() {
    var index = this.props.userSettings[
      this.props.currentUserAddress
    ].subscriptions.findIndex(
      forum => forum.address === this.props.forumAddress
    );
    if (index === -1) {
      return <SidebarSubscribeButton forumContext={this.props.forumAddress} />;
    } else {
      return (
        <SidebarUnsubscribeButton forumContext={this.props.forumAddress} />
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    userSettings: state.accounts.userSettings,
    currentUserAddress: state.accounts.currentUserAddress
  };
};

export default connect(mapStateToProps)(SideBarSubscribeContainer);
