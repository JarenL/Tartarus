import React from 'react';
import styled from 'styled-components/macro';
import HeaderNavLink from '../NavLink';
import HeaderUsernameText from './Text';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";

const styles = theme => ({
  customBadge: {
    color: '00AFD7'
  }
});

const Wrapper = styled(HeaderNavLink)`
  // flex-shrink: 1;
  border-left: 1px solid ${props => props.theme.border};
  border-right: 1px solid ${props => props.theme.border};
  min-width: 0;
`;

const StyledBadge = styled(Badge)`
  color: ${props => props.theme.error};
`;

const HeaderUsername = props => {
  const { classes } = props;
  return (
    <Wrapper to={`/u/${props.username}`}>
      <Badge
        classes={{ badge: classes.customBadge }}
        badgeContent={10}
      >
        <HeaderUsernameText>{props.username}</HeaderUsernameText>
      </Badge>
    </Wrapper>
  );
};

HeaderUsername.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HeaderUsername);;
