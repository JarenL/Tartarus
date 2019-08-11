import React from 'react';
import styled from 'styled-components/macro';
import UpButton from '../../../../Buttons/UpButton';
import DownButton from '../../../../Buttons/DownButton';
import { Link } from 'react-router-dom';
import PermissionsContainer from './Permissions/Container';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.foreground};
  // margin-top: 12px;
`;

const AdminWrapper = styled.div`
  overflow-wrap: break-word;
  display: flex;
  border-left: none;
  padding: 8px;
  font-size: 12px;
  list-style-position: inside;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.normalText};
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  font-size: 15px;
  color: ${props => props.theme.normalText};
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

const PermissionsWrapper = styled.span`
  margin-left: 12px;
  font-size: 12px;
  color: ${props => props.theme.accent};
`;

// admin permissions
// full
// access
// config
// mail
// users
// forums
// posts

const listPermissions = props => {
  let permissions = [];
  if (props[0]) {
    permissions.push('Full');
  }

  if (props[1]) {
    permissions.push('Access');
  }

  if (props[2]) {
    permissions.push('Config');
  }

  if (props[3]) {
    permissions.push('Mail');
  }

  if (props[4]) {
    permissions.push('Users');
  }

  if (props[5]) {
    permissions.push('Forums');
  }

  if (props[6]) {
    permissions.push('Posts');
  }
  return permissions;
};

const Admin = props => {
  return (
    <Wrapper>
      <AdminWrapper>
        <div>
          <StyledLink to={`/u/${props.admin}`}>{props.admin}</StyledLink>
          <PermissionsWrapper>
            {listPermissions(props.permissions).join(', ')}
          </PermissionsWrapper>
        </div>
        <ButtonWrapper>
          {props.showDetails ? (
            <UpButton size={18} onClick={props.toggleShowDetails} />
          ) : (
            <DownButton size={18} onClick={props.toggleShowDetails} />
          )}
        </ButtonWrapper>
      </AdminWrapper>
      {props.showDetails ? (
        <PermissionsContainer
          togglePermissions={props.toggleShowDetails}
          permissions={props.permissions}
          admin={props.admin}
        />
      ) : null}
    </Wrapper>
  );
};

export default Admin;
