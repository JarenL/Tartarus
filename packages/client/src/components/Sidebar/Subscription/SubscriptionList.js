import React, { Component } from 'react';
import SubscriptionItem from './SubscriptionItem';

class SubscriptionList extends Component {
  render() {
    const subscriptions = this.props.forums.map((forum, index) => {
      if (forum === 'all') {
        return <SubscriptionItem key={index} forumName={'all'} />;
      } else {
        return (
          <SubscriptionItem
            key={index}
            forumName={forum.forumName}
            editSubscriptions={this.props.editSubscriptions}
            handleRemoveSubscription={this.props.handleRemoveSubscription}
          />
        );
      }
    });
    return subscriptions;
  }
}

export default SubscriptionList;
