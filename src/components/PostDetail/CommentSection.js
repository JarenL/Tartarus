import React from 'react';
import Empty from '../shared/Empty';
import CommentList from '../CommentList';

const PostDetailCommentSection = props => (
  <>
    {!props.comments || props.comments.length === 0 ? (
      <Empty comments />
    ) : (
      <CommentList forumName={props.forumName} comments={props.comments} />
    )}
  </>
);

export default PostDetailCommentSection;
