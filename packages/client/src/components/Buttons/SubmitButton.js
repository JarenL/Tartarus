
import React from 'react';
import styled from 'styled-components/macro';
import Button from '../shared/Button';

const StyledSubmitButton = styled(Button)`
  align-self: flex-end;
  margin: 4px;
  padding: 4px 12px;
`;

const SubmitButton = props => (
  <StyledSubmitButton type='submit'>submit</StyledSubmitButton>
);

export default SubmitButton;