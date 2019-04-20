import React, { Component } from 'react';
import PostListItem from './PostListItem';
import ReactList from 'react-list';

class PostList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPosts: []
    };
  }

  renderItem(index, key) {
    return <PostListItem key={key} post={this.props.posts[index].args} />;
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
