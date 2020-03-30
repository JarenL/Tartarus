import React from 'react';
import styled from 'styled-components/macro';
import Button from '../shared/Button';

const AdminButton = styled(Button)`
  border-radius: 2px 2px 2px 2px;
  padding: 16px;
  margin: 4px;
  text-decoration: none;
  text-align: center;
`;

const CreateAdminButton = props => (
  <AdminButton onClick={props.createAdmin}>add admin</AdminButton>
);

export default CreateAdminButton;
