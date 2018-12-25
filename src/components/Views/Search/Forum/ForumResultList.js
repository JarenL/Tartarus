import React, { Component } from 'react';
import ForumResultContainer from './ForumResultContainer';
import { Link } from "react-router-dom";

export default class ForumResultList extends Component {
  render() {
    const forumContainers = this.props.forums.map(forum => {
      return (
        <Link to={"/forum/" + forum.address} style={{ textDecoration: 'none', color: 'black' }} key={forum.address}>
          <div >
            <ForumResultContainer
              address={forum.address}
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

