import React from 'react';
import styled from 'styled-components/macro';
import SidebarCreatePostButton from './CreatePostButton';
import SidebarCategoryList from './CategoryList';
import SidebarSubscribeContainer from './Subscribe/SidebarSubscribeContainer';

const Wrapper = styled.aside`
  display: flex;
  flex-direction: column;
  flex-basis: 240px;
  margin-left: 24px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 2px;
  background-color: ${props => props.theme.foreground};

  @media (max-width: 768px) {
    display: none;
  }
`;

const Sidebar = props => {
  if (props.params.forumAddress !== undefined) {
    return (
      <Wrapper>
        <SidebarSubscribeContainer forumAddress={props.params.forumAddress} />
        <SidebarCreatePostButton />
        <SidebarCategoryList />
      </Wrapper>
    );
  } else {
    return (
      <Wrapper>
        <SidebarCategoryList />
      </Wrapper>
    );
  }
};

export default Sidebar;
