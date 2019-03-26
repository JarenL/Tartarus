import React from 'react';
import styled from 'styled-components/macro';
import UserSidebarItem from './UserSidebarItem';
import UserSidebarHeader from './UserSidebarHeader';
import categories from './UserCategories';

const CategoryList = styled.nav`
  display: flex;
  flex-direction: column;
`;

const mapCategories = categories =>
  categories.map((category, index) => {
    return <UserSidebarItem key={index} category={category} />;
  });

const UserSidebarCategoryList = props => (
  <CategoryList>
    <UserSidebarHeader username={props.username} />
    {mapCategories(['all', ...categories])}
  </CategoryList>
);

export default UserSidebarCategoryList;
