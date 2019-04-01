import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';
import SidebarCategoryListHeader from './Header';
import SidebarCategoryListItem from './Item';

const CategoryList = styled.nav`
  display: flex;
  flex-direction: column;
`;

const mapCategories = forums =>
  forums.map((forum, index) => {
    if (forum === 'all') {
      return <SidebarCategoryListItem key={index} name={'all'} />;
    } else {
      return (
        <SidebarCategoryListItem
          key={index}
          name={forum.name}
          address={forum.address}
        />
      );
    }
  });

const SidebarCategoryList = props => (
  <CategoryList>
    <SidebarCategoryListHeader />
    {mapCategories([
      'all',
      ...props.userSettings[props.userAddress].subscriptions
    ])}
  </CategoryList>
);

function mapStateToProps(state) {
  return {
    userSettings: state.user.userSettings,
    userAddress: state.user.userAddress
  };
}

export default connect(mapStateToProps)(SidebarCategoryList);
