import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { headerItem } from '../shared/helpers';
import TartarusLogo from './TartarusLogo.svg';

const Logo = styled(Link)`
  ${headerItem};

  margin-right: auto;
  font-size: 24px;
  font-weight: 500;
  color: ${props => props.theme.normalText};
  text-decoration: none;

  @media (max-width: 425px) {
    padding: 0 8px 0 16px;
    font-size: 19px;
  }
`;

const HeaderLogo = () => {
  return (
    <Logo to='/'>
      <img src={TartarusLogo} alt='My logo' width='32px' height='32px' />
      tartarus
    </Logo>
  );
};

export default HeaderLogo;
