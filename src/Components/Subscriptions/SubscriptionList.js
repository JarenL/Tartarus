import React, { Component } from 'react';
import PostContainer from './PostContainer';
import { Link } from "react-router-dom";
import SubscriptionContainer from './SubscriptionContainer';

export default class PostList extends Component {
  render() {
    const postContainers = this.props.forumSubscriptions.map(subscription => {
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
        {postContainers}
      </div>
    );
  }
}

