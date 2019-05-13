import React from 'react';
import styled from 'styled-components/macro';
import NavLink from '../../shared/NavLink';
import { withRouter } from 'react-router';

const Item = styled(NavLink)`
  padding: 12px;
  font-size: 15px;
  text-decoration: none;
  color: ${props => props.theme.normalText};

  ::after {
    left: -1px;
    top: 0;
    bottom: 0;
    border-left: 3px solid ${props => props.theme.accent};
  }
`;

const UserSidebarItem = props => {
  console.log(props);
  const isAll = props.category === 'all';
  return (
    <Item
      exact={isAll}
      to={
        isAll
          ? `/u/${props.match.params.user}`
          : `/u/${props.match.params.user}/${props.category}`
      }
    >
      {props.category}
    </Item>
  );
};

export default withRouter(UserSidebarItem);
