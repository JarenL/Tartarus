import React from 'react';
import styled from 'styled-components/macro';
import Button from '../shared/Button';

const StyledCommentButton = styled(Button)`
  align-self: flex-end;
  margin: 4px;
  padding: 4px 12px;
`;

const CommentButton = props => (
  <StyledCommentButton type='button' onClick={props.onClick} >comment</StyledCommentButton>
);

export default CommentButton;
