import React from 'react';
import styled from 'styled-components/macro';
import Button from '../shared/Button';

const StyledCheckButton = styled(Button)`
  align-self: flex-end;
  margin: 4px;
  padding: 4px 12px;
`;

const CheckButton = props => (
  <StyledCheckButton type='button' onClick={props.onClick}>
    check
  </StyledCheckButton>
);

export default CheckButton;
