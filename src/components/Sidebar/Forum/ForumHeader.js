import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { MdSearch } from 'react-icons/md';
import { overflow } from '../../shared/helpers';

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

const SubHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  color: ${props => props.theme.mutedText};
`;

const SubHeaderText = styled.div`
  ${wideFont};
  ${overflow};
  display: block;
  max-width: 200px;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.mutedText};
`;

const SubHeaderIcon = styled(MdSearch)`
  vertical-align: sub;
  cursor: pointer;
  align-self: flex-start;
  margin-right: 2px;
  margin-left: 2px;
  &:last-child {
    margin-right: 0;
  }
  color: ${props => props.theme.accent};
  &:hover {
    color: ${props => props.theme.accent};
    & > svg {
      color: ${props => props.theme.accent} !important;
    }
  }
`;

const ForumHeader = props => (
  <Wrapper>
    <Header>
      <HeaderText>{props.name}</HeaderText>
    </Header>
    <SubHeader>
      <SubHeaderIcon
        size={15}
        onClick={() =>
          window.open('https://ropsten.etherscan.io/address/' + props.address)
        }
      />
      <SubHeaderText>{props.address}</SubHeaderText>
    </SubHeader>
  </Wrapper>
);

export default ForumHeader;
