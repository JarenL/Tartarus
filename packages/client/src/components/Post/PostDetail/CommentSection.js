import React from 'react';
import Empty from '../../shared/Empty';
import CommentList from '../../Comment/CommentList/Component';
import styled from 'styled-components/macro';

const Wrapper = styled.div`
  margin-top: 8px;
`;

const CommentSection = props => (
  <Wrapper>
    {!props.comments || props.comments.length === 0 ? (
      <Empty comments />
    ) : (
      <CommentList forumName={props.forumName} comments={props.comments} />
    )}
  </Wrapper>
);

export default CommentSection;
