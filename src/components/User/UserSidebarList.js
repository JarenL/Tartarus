import React from 'react';
import styled from 'styled-components/macro';
import UserSidebarItem from './UserSidebarItem';
import UserSidebarHeader from './UserSidebarHeader';
import categories from './UserCategories';

const CategoryList = styled.nav`
  display: flex;
  flex-direction: column;
`;

const mapCategories = (categories, props) =>
  categories.map((category, index) => (
    <UserSidebarItem key={index} category={category} />
  ));

const SidebarCategoryList = props => (
  <CategoryList>
    <UserSidebarHeader />
    {mapCategories(['overview', ...categories])}
  </CategoryList>
);

export default SidebarCategoryList;
