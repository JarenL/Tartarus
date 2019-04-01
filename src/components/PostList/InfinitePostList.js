import React, { Component } from 'react';
import styled from 'styled-components/macro';
import PostListItem from './PostListItem';
import ReactList from 'react-list';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';

class PostList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPosts: []
    };
  }

  renderItem(index, key) {
    return (
      <PostListItem
        key={key}
        address={this.props.posts[index].args.postAddress}
      />
    );
  }

  render() {
    return (
      <ReactList
        itemRenderer={this.renderItem.bind(this)}
        length={this.props.posts.length}
        type='simple'
      />
    );
  }
}

export default PostList;
