import React from 'react';
import styled from 'styled-components/macro';
import SubmitButton from '../shared/form/SubmitButton';

const StyledCommentButton = styled(SubmitButton)`
  margin: 4px;
  padding: 4px 12px;
`;

const CommentFormCommentButton = props => (
  <StyledCommentButton type='button' onClick={props.onClick} >comment</StyledCommentButton>
);

export default CommentFormCommentButton;
