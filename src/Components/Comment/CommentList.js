import React, { Component } from 'react';
import CommentContainer from './CommentContainer';
import { Link } from "react-router-dom";

export default class CommentList extends Component {
  render() {
    const commentContainers = this.props.comments.map(comment => {
      return (
        <Link to={"/comment/" + comment.address} style={{ textDecoration: 'none', color: 'black' }} key={comment.address}>
          <div >
            <CommentContainer
              address={comment.address}
            />
          </div>
        </Link>
      )
    });
    return (
      <div>
        {commentContainers}
      </div>
    );
  }
}
