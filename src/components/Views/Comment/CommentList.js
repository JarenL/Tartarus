import React, { Component } from 'react';
import CommentContainer from './CommentContainer';
import { Link } from "react-router-dom";
import Divider from "@material-ui/core/Divider"

export default class CommentList extends Component {
  render() {
    console.log(this.props.comments)
    const commentContainers = this.props.comments.map(comment => {
      return (
        <Link to={"/comment/" + comment.args.commentAddress} style={{ textDecoration: 'none', color: 'black' }} key={comment.args.commentAddress}>
          <div >
            <CommentContainer
              address={comment.args.commentAddress}
            />
            <Divider/>
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
