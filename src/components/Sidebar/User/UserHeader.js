import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.accent};
  color: #ffffff;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
`;

const HeaderText = styled.div`
  ${wideFont};
  ${overflow};
  display: block;
  font-size: 16px;
  align-items: center;
  justify-content: center;
`;

const UserHeader = props => (
  <Wrapper>
    <Header>
      <HeaderText>{props.username}</HeaderText>
    </Header>
  </Wrapper>
);

export default UserHeader;
