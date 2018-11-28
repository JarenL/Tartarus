import React, { Component } from 'react';
import CommentContainer from './CommentContainer';
import { Link } from "react-router-dom";

export default class CommentList extends Component {
  render() {
    const commentContainers = this.props.comments.map(comment => {
      return (
          <div >
            <CommentContainer
              address={comment.address}
            />
          </div>
      )
    });
    return (
      <div>
        {commentContainers}
      </div>
    );
  }
}
