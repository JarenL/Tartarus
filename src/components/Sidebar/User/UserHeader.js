import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import { MdSearch } from 'react-icons/md';

const Header = styled.span`
  ${wideFont};
  display: block;
  padding: 12px;
  text-align: center;
  color: ${props => props.theme.normalText};
  border-bottom: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.accent};
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
  ${wideFont};
  ${overflow};
  display: block
  text-align: center;
  color: ${props => props.theme.accent};
`;

const SubHeaderIcon = styled.span`
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserHeader = props => (
  <Wrapper>
    <Header>{props.username}</Header>
    {/* <SubHeader>
      <SubHeaderIcon>
        <MdSearch
          size={16}
          onClick={() =>
            window.open(
              'https://ropsten.etherscan.io/address/' + props.userAddress
            )
          }
        />
      </SubHeaderIcon>
      <SubHeaderText>{props.userAddress}</SubHeaderText>
    </SubHeader> */}
  </Wrapper>
);

export default UserHeader;
