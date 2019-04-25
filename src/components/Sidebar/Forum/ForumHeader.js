import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { MdSearch } from 'react-icons/md';
import { overflow } from '../../shared/helpers';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.foreground};
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
  font-size: 16px;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.mutedText};
`;

const ForumHeader = props => (
  <Wrapper>
    <Header>
      <HeaderText>{props.name}</HeaderText>
    </Header>
  </Wrapper>
);

export default ForumHeader;
