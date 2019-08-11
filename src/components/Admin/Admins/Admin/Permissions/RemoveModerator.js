import React from 'react';
import styled from 'styled-components/macro';
import Button from '../../../../shared/Button';

const RemoveAdmin = styled(Button)`
  align-self: flex-start;
  margin: 4px;
  padding: 4px 12px;
`;

const RemoveAdminButton = props => (
  <RemoveAdmin onClick={props.removeAdmin}>remove</RemoveAdmin>
);

export default RemoveAdminButton;
