import React from 'react';
import styled from 'styled-components/macro';
import SearchButton from '../Buttons/SearchButton';
import FilterButton from '../Buttons/FilterButton';
import HelpButton from '../Buttons/HelpButton';

const Wrapper = styled.aside`
  position: sticky;
  top: 60px;
  display: flex;
  flex-direction: column;
  flex-basis: 40px;
  margin-right: 24px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 2px;
  background-color: ${props => props.theme.foreground};

  @media (max-width: 768px) {
    display: none;
  }
`;

const UtilitySidebar = props => {
  if (props.user.userAddress === null || props.user.userAddress === undefined) {
    return null;
  } else {
    return (
      <Wrapper>
        <SearchButton forumAddress={props.params.forumAddress} />
        <FilterButton forumAddress={props.params.forumAddress} />
        <HelpButton forumAddress={props.params.forumAddress} />
      </Wrapper>
    );
  }
};

export default UtilitySidebar;
