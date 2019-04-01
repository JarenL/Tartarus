import React from 'react';
import styled from 'styled-components/macro';
import UserSidebarItem from './UserItem';
import categories from './UserCategories';
import { wideFont } from '../shared/helpers';
import { overflow } from '../shared/helpers';

const List = styled.nav`
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.span`
  ${wideFont};
  display: flex;
  justify-content: center;
  alignitems: center;
  padding: 12px;
  color: ${props => props.theme.mutedText};
`;

const mapCategories = categories =>
  categories.map((category, index) => {
    return <UserSidebarItem key={index} category={category} />;
  });

const UserList = props => (
  <Wrapper>
    <Header>{'history'}</Header>
    <List>{mapCategories(['all', ...categories])}</List>
  </Wrapper>
);

export default UserList;
