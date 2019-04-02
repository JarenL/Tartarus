import React from 'react';
import styled from 'styled-components/macro';
import { MdSearch } from 'react-icons/md';

  // ${transition('filter', 'box-shadow')};
  // ${wideFont};

  // border: none;
  // border-radius: 3px;
  // padding: 8px 24px;
  // background-color: ${props => props.theme.accent};
  // cursor: pointer;
  // color: #ffffff;
  // outline: none;

  // :hover {
  //   filter: brightness(110%);
  // }

  // :active {
  //   filter: brightness(90%);
  // }

  // :focus {
  //   box-shadow: 0 0 0 2px ${props => props.theme.accent + '4d'};
  // }

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.accent};
  :hover {
    filter: brightness(110%);
  }

  :active {
    filter: brightness(90%);
  }

  :focus {
    box-shadow: 0 0 0 2px ${props => props.theme.accent + '4d'};
  }
`;

const Search = styled(MdSearch)`
  cursor: pointer;
  color: #ffffff;
  &:last-child {
    margin-right: 0;
  }
  // &:hover {
  //   color: ${props => props.theme.accent};
  //   & > svg {
  //     color: ${props => props.theme.accent} !important;
  //   }
  // }
`;

const SearchButton = () => (
  <Wrapper>
    <Search size={25} />
  </Wrapper>
);

export default SearchButton;
