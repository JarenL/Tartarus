import React, { Component } from 'react';
import PostContainer from './PostContainer';
import { Link } from "react-router-dom";

export default class PostList extends Component {
  render() {
    const postContainers = this.props.posts.map(post => {
      return (
        <Link to={"/post/" + post.address} style={{ textDecoration: 'none', color: 'black' }} key={post.address}>
          <div >
            <PostContainer
              address={post.address}
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

