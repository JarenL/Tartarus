import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';
import SidebarCategoryListHeader from './Header';
import categories from '../../../categories';
import ForumContainer from './ForumContainer';
import SidebarCategoryListItem from './Item';

const CategoryList = styled.nav`
  display: flex;
  flex-direction: column;
`;

const mapCategories = forums =>
  forums.map((forum, index) => {
    if (forum === 'all') {
      return <SidebarCategoryListItem name={'all'} />;
    } else {
      console.log(forum);
      return <ForumContainer key={index} forumAddress={forum.address} />;
    }
  });

const SidebarCategoryList = props => (
  <CategoryList>
    <SidebarCategoryListHeader />
    {mapCategories([
      'all',
      ...props.userSettings[props.currentUserAddress].subscriptions
    ])}
  </CategoryList>
);

function mapStateToProps(state) {
  return {
    userSettings: state.accounts.userSettings,
    currentUserAddress: state.accounts.currentUserAddress
  };
}

export default connect(mapStateToProps)(SidebarCategoryList);
