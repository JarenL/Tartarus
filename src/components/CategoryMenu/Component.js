import React from 'react';
import styled from 'styled-components/macro';
import { Route } from 'react-router-dom';
import CategoryMenuDropdown from './Dropdown';

const CategoryMenu = props => {
  const subscriptions = [
    'all',
    ...props.userSettings[props.username].subscriptions
  ];
  if (props.username !== null && subscriptions.length > 1) {
    return (
      <Route
        path='/f/:forumName'
        children={({ match, history }) => (
          <CategoryMenuDropdown
            subscriptions={subscriptions}
            category={match ? match.params.forumName : 'all'}
            history={history}
          />
        )}
      />
    );
  } else {
    return null;
  }
};

export default CategoryMenu;
