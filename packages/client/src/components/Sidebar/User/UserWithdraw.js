import React from 'react';
import styled from 'styled-components/macro';
import WithdrawButton from '../../Buttons/WithdrawButton';
import { wideFont } from '../../shared/helpers';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  // border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.foreground};
`;

const TextWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  padding-top: 4px;
  padding-bottom: 4px;
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

const BalanceHeader = styled.span`
  ${wideFont};
  display: flex;
  justify-content: center;
  alignitems: center;
  padding: 12px;
  color: ${props => props.theme.mutedText};
  border-bottom: 1px solid ${props => props.theme.border};
`;

const UserWithdraw = props => {
  return (
    <Wrapper>
      <BalanceHeader>{'Balance'}</BalanceHeader>
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
