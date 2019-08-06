import React from 'react';
import styled from 'styled-components/macro';
import NavLink from '../../shared/NavLink';
import { withRouter } from 'react-router';

const Item = styled(NavLink)`
  padding: 12px;
  font-size: 15px;
  text-decoration: none;
  width: 100%;
  color: ${props => props.theme.normalText};

  ::after {
    left: -1px;
    top: 0;
    bottom: 0;
    border-left: 3px solid ${props => props.theme.accent};
  }
`;

const AdminSidebarItem = props => {
  const isAll = props.category === 'activity';
  return (
    <Item
      exact={isAll}
      to={
        isAll ? `/admin/administrate` : `/admin/administrate/${props.category}`
      }
    >
      {props.category}
    </Item>
  );
};

export default withRouter(AdminSidebarItem);
