import React, { Component } from 'react';
import ReactList from 'react-list';
import CommentListItem from './Item';

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPosts: [],
      currentComment: null
    };
  }

  handleReply = props => {
    if (props === this.state.currentComment) {
      this.setState({
        currentComment: null
      });
    } else {
      this.setState({
        currentComment: props
      });
    }
  };

  renderItem(index, key) {
    return (
      <CommentListItem
        key={key}
        forumName={this.props.forumName}
        comment={this.props.comments[index].args}
        currentComment={this.state.currentComment}
        handleReply={this.handleReply}
      />
    );
  }

  render() {
    return (
      <ReactList
        itemRenderer={this.renderItem.bind(this)}
        length={this.props.comments.length}
        type='simple'
      />
    );
  }
}

export default CommentList;
