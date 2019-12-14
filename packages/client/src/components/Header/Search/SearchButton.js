import React from 'react';
import styled from 'styled-components/macro';
import { MdSearch } from 'react-icons/md';
import { headerItem } from '../../shared/helpers';
import { transition } from '../../shared/helpers';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  margin: auto;
  margin-right: 2px;
`;

const Search = styled(MdSearch)`
  // ${headerItem};
  cursor: pointer;
  // width: 20px;
  // height: 20px;
  & path {
    ${transition('fill')};

    fill: ${props => props.theme.mutedText};
  }
  
  @media (max-width: 425px) {
    width: 18px;
    height: 18px;
  }

  @media (hover: hover) {
    :hover path {
      fill: ${props => props.theme.accent};
    }
  }
`;

const SearchButton = props => (
  <Wrapper>
    <Search size={20} onClick={props.handleSubmit} />
  </Wrapper>
);

export default SearchButton;
