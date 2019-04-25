import React from 'react';
import Empty from '../shared/Empty';
import CommentList from '../CommentList';
import styled from 'styled-components/macro';

const Wrapper = styled.div`
  margin-top: 8px;
`;

const PostDetailCommentSection = props => (
  <Wrapper>
    {!props.comments || props.comments.length === 0 ? (
      <Empty comments />
    ) : (
      <CommentList forumName={props.forumName} comments={props.comments} />
    )}
  </Wrapper>
);

export default PostDetailCommentSection;
