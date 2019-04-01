import React from 'react';
import styled from 'styled-components/macro';
import HeaderLogo from './Logo';
import HeaderDarkButtonContainer from './DarkButton/Container';
import HeaderUsername from './Username';
import HeaderNavLink from './NavLink';
import SearchBar from './SearchBox';
import { userLogout } from '../../redux/actions/actions';

const Wrapper = styled.header`
  position: sticky;
  z-index: 10;
  top: 0;
  display: flex;
  alignitems: 'center';
  justifycontent: 'center';
  align-items: stretch;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px ${props => props.theme.shadow};
  border-bottom: 1px solid ${props => props.theme.border};
  height: 48px;
  padding: 0 10vw;
  background-color: ${props => props.theme.foreground};
  user-select: none;

  @media (max-width: 425px) {
    margin-bottom: 16px;
    height: 40px;
  }

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const Header = props => (
  <Wrapper>
    <HeaderLogo />
    {/* <SearchBar /> */}
    <HeaderDarkButtonContainer />
    {props.user.userAddress ? (
      <>
        {/* <HeaderUsername username={user.username} /> */}
        <HeaderUsername user={props.user} />

        <HeaderNavLink as='span' onClick={() => props.dispatch(userLogout())}>
          log out
        </HeaderNavLink>
      </>
    ) : (
      <>
        <HeaderNavLink to='/login'>log in</HeaderNavLink>
        <HeaderNavLink to='/signup'>sign up</HeaderNavLink>
      </>
    )}
  </Wrapper>
);

export default Header;
