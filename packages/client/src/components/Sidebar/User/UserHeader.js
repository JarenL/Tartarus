import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import UserBlockie from './UserBlockie';
import Watch from '../../Buttons/Watch';
import Unwatch from '../../Buttons/Unwatch';

const Header = styled.span`
  ${wideFont};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  color: ${props => props.theme.mutedText};
  background-color: ${props => props.theme.foreground};
  border-bottom: 1px solid ${props => props.theme.border};
`;

const HeaderText = styled.div`
  ${wideFont};
  ${overflow};
  display: flex;
  font-size: 16px;
  color: ${props => props.theme.mutedText};
`;

const BlockieWrapper = styled.div`
  justify-self: flex-end;
`;

const ButtonWrapper = styled.div`
  justify-self: flex-start;
`;

const UserHeader = props => {
  return (
    <Header>
      <ButtonWrapper>
        {props.showWatch ? (
          props.watched ? (
            <Unwatch
              size={24}
              onClick={() => props.handleUnwatch(props.userHex)}
            />
          ) : (
            <Watch size={24} onClick={() => props.handleWatch(props.userHex)} />
          )
        ) : null}
      </ButtonWrapper>

      <HeaderText>{props.user}</HeaderText>
      <BlockieWrapper>
        <UserBlockie user={props.userHex} />
      </BlockieWrapper>
    </Header>
  );
};

export default UserHeader;
