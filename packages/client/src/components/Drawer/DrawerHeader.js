import React, { Component } from 'react';
import styled from 'styled-components/macro';
import UserHeader from '../Sidebar/User/UserHeader';
import HeaderLogo from '../Header/Logo';
import DrawerClose from './DrawerClose';
import { IconButton } from '@material-ui/core';
import { setDrawerState } from '../../redux/actions/actions';

const Header = styled.div`
  background-color: ${props => props.theme.foreground};
  display: flex;
  flex-direction: row;
  height: 48px;
  width: 100%;
  align-items: stretch;
  // justify-content: center;
  border-bottom: 1px solid ${props => props.theme.border};
  @media (max-width: 425px) {
    height: 40px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
`;

class DrawerHeader extends Component {
  render() {
    return (
      <>
        <Header>
          <ButtonWrapper>
            <IconButton
              disableRipple={true}
              color='inherit'
              aria-label='Open drawer'
              onClick={() => this.props.handleDrawerToggle()}
            >
              <DrawerClose />
            </IconButton>
          </ButtonWrapper>
          <HeaderLogo />
        </Header>
        {/* {this.props.username !== null ? (
          <UserHeader
            user={this.props.username}
            userHex={this.props.userHex}
          />
        ) : null} */}
      </>
    );
  }
}

export default DrawerHeader;
