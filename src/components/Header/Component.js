import React from 'react';
import styled from 'styled-components/macro';
import HeaderLogo from './Logo';
import HeaderDarkButtonContainer from './DarkButton/Container';
import HeaderUsername from './Username';
import HeaderNavLink from './NavLink';
import { userLogout } from '../../redux/actions/actions';
import SearchContainer from './Search/SearchContainer';
import FilterContainer from './Filter/FilterContainer';

const Wrapper = styled.header`
  position: sticky;
  z-index: 10;
  top: 0;
  display: flex;
  align-items: 'center';
  justify-content: 'center';
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
    <FilterContainer />
    <SearchContainer />
    <HeaderDarkButtonContainer />
    {console.log(props.username)}
    {props.username ? (
      <>
        <HeaderUsername username={props.username} />
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
