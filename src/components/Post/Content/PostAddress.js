import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { MdSearch } from 'react-icons/md';
import { overflow } from '../../shared/helpers';

const Wrapper = styled.div`
  display: block
  text-align: center;
  color: ${props => props.theme.accent};
`;

const SubHeaderText = styled.span`
  ${wideFont};
  ${overflow};
  font-size: 10px;
  color: ${props => props.theme.mutedText};
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

const PostAddress = props => (
  <Wrapper>
    <SubHeaderIcon>
      <MdSearch
        size={14}
        onClick={() =>
          window.open('https://ropsten.etherscan.io/address/' + props.postAddress)
        }
      />
    </SubHeaderIcon>
    <SubHeaderText>{props.postAddress}</SubHeaderText>
  </Wrapper>
);

export default PostAddress;
