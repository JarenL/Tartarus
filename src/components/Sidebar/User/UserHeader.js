import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import { MdSearch } from 'react-icons/md';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  color: ${props => props.theme.mutedText};
`;

const HeaderText = styled.div`
  ${wideFont};
  ${overflow};
  display: block;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.mutedText};
`;

const UserHeader = props => (
  <Wrapper>
    {console.log(props.username)}
    <Header>
      <HeaderText>{props.username}</HeaderText>
    </Header>
  </Wrapper>
);

export default UserHeader;
