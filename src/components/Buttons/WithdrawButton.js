import React from 'react';
import styled from 'styled-components/macro';
import Button from '../shared/Button';

const Withdraw = styled(Button)`
  align-self: flex-end;
  margin: 4px;
  padding: 4px 12px;
`;

const WithdrawButton = props => (
  <Withdraw onClick={props.handleWithdraw}>withdraw</Withdraw>
);

export default WithdrawButton;
