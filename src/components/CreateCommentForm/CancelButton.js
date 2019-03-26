import React from 'react';
import styled from 'styled-components/macro';
import SubmitButton from '../shared/form/SubmitButton';

const StyledCancelButton = styled(SubmitButton)`
  margin: 4px;
  padding: 4px 12px;
`;

const CommentFormCancelButton = props => (
  <StyledCancelButton type='button' onClick={props.onClick} >cancel</StyledCancelButton>
);

export default CommentFormCancelButton;
