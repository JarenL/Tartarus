import React from 'react';
import styled from 'styled-components/macro';
import HeaderNavLink from '../NavLink';
import HeaderUsernameText from './Text';
import Badge from '@material-ui/core/Badge';

const Wrapper = styled(HeaderNavLink)`
  // flex-shrink: 1;
  border-left: 1px solid ${props => props.theme.border};
  border-right: 1px solid ${props => props.theme.border};
  min-width: 0;
`;

const StyledBadge = styled(Badge)`
  color: ${props => props.theme.accent};
`;

const HeaderUsername = props => (
  <Wrapper to={`/u/${props.username}`}>
    <StyledBadge badgeContent={props.notifications}>
      <HeaderUsernameText>{props.username}</HeaderUsernameText>
    </StyledBadge>
  </Wrapper>
);

export default HeaderUsername;
