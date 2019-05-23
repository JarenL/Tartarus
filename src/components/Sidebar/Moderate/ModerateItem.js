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

const ModeratorSidebarItem = props => {
  const isAll = props.category === 'activity';
  return (
    <Item
      exact={isAll}
      to={
        isAll
          ? `/f/${props.match.params.forumName}/moderate`
          : `/f/${props.match.params.forumName}/moderate/${props.category}`
      }
    >
      {props.category}
    </Item>
  );
};

export default withRouter(ModeratorSidebarItem);
