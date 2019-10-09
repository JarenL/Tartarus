import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import UserBlockie from './UserBlockie';
import Watch from '../../Buttons/Watch';

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
  width: 100%;
  display: flex;
  font-size: 16px;
  align-items: center;
  justify-content: center;
  // margin-left: 16px;
  color: ${props => props.theme.mutedText};
`;

// const ButtonWrapper = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: flex-end;
// `;

const BlockieWrapper = styled.div`
  align-self: flex-end;
`;

const UserHeader = props => {
  console.log(props.userHex);
  return (
    <Header>
      {/* <ButtonWrapper>
      </ButtonWrapper> */}
      <Watch size={32} />
      <HeaderText>{props.user}</HeaderText>

      <BlockieWrapper>
        <UserBlockie user={props.userHex} />
      </BlockieWrapper>
    </Header>
  );
};

export default UserHeader;
