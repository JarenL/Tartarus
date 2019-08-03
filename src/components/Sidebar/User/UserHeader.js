import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import UserBlockie from './UserBlockie';

const Header = styled.span`
  ${wideFont};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  color: ${props => props.theme.mutedText};
  background-color: ${props => props.theme.foreground};
  // border-bottom: 1px solid ${props => props.theme.border};
`;

const HeaderText = styled.div`
  ${wideFont};
  ${overflow};
  display: block;
  font-size: 16px;
  padding-left: 4px;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.mutedText};
`;

const BlockieWrapper = styled.div`
  align-self: flex-end;
`;

const UserHeader = props => {
  console.log(props.userHex)
  return (
    <Header>
      <HeaderText>{props.user}</HeaderText>
      <BlockieWrapper>
        <UserBlockie user={props.userHex} />
      </BlockieWrapper>
    </Header>
  );
};

export default UserHeader;
