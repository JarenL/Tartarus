import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { MdSearch } from 'react-icons/md';
import { overflow } from '../../shared/helpers';
import { ifNotProp, prop } from 'styled-tools';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Header = styled.span`
  ${wideFont};
  display: block;
  padding: 12px;
  text-align: center;
  color: ${props => props.theme.mutedText};
`;

const SubHeader = styled.div`
  ${wideFont};
  ${overflow};
  max-width: 225px;
  display: block
  text-align: center;
  color: ${props => props.theme.accent};
`;

const SubHeaderText = styled.span`
  display: block
  text-align: center;
  justify-content: center;
  alignitems: center;
  color: ${props => props.theme.accent};
`;

const SubHeaderIcon = styled(MdSearch)`
  vertical-align: sub;
  cursor: pointer;
  margin-right: 2px;
  margin-left: 2px;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    color: ${props => props.theme.accent};
    & > svg {
      color: ${props => props.theme.accent} !important;
    }
  }
`;

const ForumHeader = props => (
  <Wrapper>
    <Header>{props.name}</Header>
    <SubHeader>
      <SubHeaderIcon
        size={16}
        onClick={() =>
          window.open('https://ropsten.etherscan.io/address/' + props.address)
        }
      />
      <SubHeaderText>{props.address}</SubHeaderText>
    </SubHeader>
  </Wrapper>
);

export default ForumHeader;
