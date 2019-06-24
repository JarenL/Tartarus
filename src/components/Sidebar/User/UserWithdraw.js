import React from 'react';
import styled from 'styled-components/macro';
import WithdrawButton from './WithdrawButton';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  // border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.foreground};
`;

const TextWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: ${props => props.theme.normalText};
`;

const BalanceWrapper = styled.div`
  overflow-wrap: break-word;
  display: flex;
  border-left: none;
  padding: 8px;
  font-size: 12px;
  list-style-position: inside;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.normalText};
  justify-content: space-between;
  align-content: center;
`;

const ButtonWrapper = styled.div`
  align-self: flex-end;
`;

const UserWithdraw = props => {
  return (
    <Wrapper>
      <BalanceWrapper>
        <TextWrapper>{`${props.userBalance} ETH`}</TextWrapper>
        <ButtonWrapper>
          {props.userBalance > 0 ? <WithdrawButton handleWithdraw={props.handleWithdraw} /> : null}
        </ButtonWrapper>
      </BalanceWrapper>
    </Wrapper>
  );
};

export default UserWithdraw;
