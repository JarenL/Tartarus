import React from 'react';
import styled from 'styled-components/macro';
import Button from '../shared/Button';

const ModeratorButton = styled(Button)`
  border-radius: 2px 2px 2px 2px;
  padding: 16px;
  margin: 4px;
  text-decoration: none;
  text-align: center;
`;

const CreateModeratorButton = props => (
  <ModeratorButton onClick={props.createModerator}>add moderator</ModeratorButton>
);

export default CreateModeratorButton;
