import React from 'react';
import styled from 'styled-components/macro';
import UserSidebarItem from './UserItem';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';

const Wrapper = styled.div`
  display: flex;
  margin-top: 12px;
  flex-direction: column;
  background-color: ${props => props.theme.foreground};
  border: 1px solid ${props => props.theme.border};
`;

const List = styled.nav`
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
  border-bottom: 1px solid ${props => props.theme.border};
`;

const mapCategories = categories =>
  categories.map((category, index) => {
    return <UserSidebarItem key={index} category={category} />;
  });

const UserList = props => (
  <Wrapper>
    <Header>{'history'}</Header>
    <List>{mapCategories(['all', ...props.categories])}</List>
  </Wrapper>
);

export default UserList;
