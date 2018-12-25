import React, { Component } from 'react';
import PostContainer from './PostContainer';
import { Link } from "react-router-dom";

export default class PostList extends Component {
  render() {
    console.log(this.props.posts)
    const postContainers = this.props.posts.map(post => {
      return (
        <Link to={"/post/" + post.args.postAddress} style={{ textDecoration: 'none', color: 'black' }} key={post.args.postAddress}>
          <div >
            <PostContainer
              address={post.args.postAddress}
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

