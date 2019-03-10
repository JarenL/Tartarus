import React, { Component } from 'react';
import { Link } from "react-router-dom";
import SubscriptionContainer from './SubscriptionContainer';

export default class SubscriptionList extends Component {
  render() {
    const forumContainers = this.props.subscriptions.map(subscription => {
      return (
        <Link to={"/forum/" + subscription.address} style={{ textDecoration: 'none', color: 'black' }} key={subscription.address}>
          <div >
            <SubscriptionContainer
              address={subscription.address}
            />
          </div>
        </Link>
      )
    });
    return (
      <div>
        {forumContainers}
      </div>
    );
  }
}

