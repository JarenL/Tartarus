import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import UpButton from '../../Buttons/UpButton';
import DownButton from '../../Buttons/DownButton';
import { Link } from 'react-router-dom';
import ModerateButton from '../../Buttons/Moderate';
import Author from '../../shared/Author';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  // border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.foreground};
  // margin-top: 12px;
`;

const HeaderWrapper = styled.div`
  ${wideFont};
  ${overflow};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  color: ${props => props.theme.mutedText};
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Admins = styled.div`
  overflow-wrap: break-word;
  margin-right: auto;
  padding: 8px;
  font-size: 12px;
  list-style-position: inside;
  // background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.normalText};
`;

const StyledLink = styled(Link)`
  list-style: none;
  text-decoration: none;
  color: ${props => props.theme.mutedText};
  &:hover {
    color: ${props => props.theme.accent};
    & > svg {
      color: ${props => props.theme.accent} !important;
    }
  }
`;

const ButtonWrapper = styled.div`
  align-self: flex-end;
`;

const Admin = props => {
  const admin = props.web3.utils.toAscii(props.admin);
  console.log(admin);
  return (
    <StyledLink to={`/u/${admin}`}>
      <li>
        <Author creatorHex={props.admin} username={admin} isAdmin={true} />
      </li>
    </StyledLink>
  );
};

const usernameToBytes32 = props => {
  let remainder = 66 - props.length;
  return props + '0'.repeat(remainder);
};

const TartarusAdmins = props => (
  <Wrapper>
    <HeaderWrapper>
      {'Admins'}
      <ButtonWrapper>
        {props.admins != null &&
        props.admins.includes(
          usernameToBytes32(props.web3.utils.fromAscii(props.username))
        ) ? (
          <StyledLink to={`/admin`}>
            <ModerateButton size={18} />
          </StyledLink>
        ) : null}
        {props.showAdmins ? (
          <UpButton size={18} onClick={props.toggleShowAdmins} />
        ) : (
          <DownButton size={18} onClick={props.toggleShowAdmins} />
        )}
      </ButtonWrapper>
    </HeaderWrapper>
    {props.showAdmins ? (
      <Admins>
        {props.admins !== null ? (
          <ul>
            {props.admins.map(function(admin) {
              return <Admin admin={admin} web3={props.web3} />;
            })}
          </ul>
        ) : (
          'None'
        )}
      </Admins>
    ) : null}
  </Wrapper>
);

export default TartarusAdmins;
