import React from 'react';
import styled from 'styled-components/macro';
import Button from '../../../../../shared/Button';

const RemoveModerator = styled(Button)`
  align-self: flex-start;
  margin: 4px;
  padding: 4px 12px;
`;

const RemoveModeratorButton = props => (
  <RemoveModerator onClick={props.removeModerator}>remove</RemoveModerator>
);

export default RemoveModeratorButton;
