import React from 'react';
import styled from 'styled-components/macro';
import Button from '../Button';

const StyledCancelButton = styled(Button)`
  align-self: flex-end;
  margin: 4px;
  padding: 4px 12px;
`;

const CancelButton = props => (
  <StyledCancelButton type='button' onClick={props.onClick} >cancel</StyledCancelButton>
);

export default CancelButton;
