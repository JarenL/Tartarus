import React from 'react';
import styled from 'styled-components/macro';
import Button from '../../shared/Button';

const ModeratorButton = styled(Button)`
  border-radius: 2px 2px 0 0;
  padding: 16px;
  text-decoration: none;
  text-align: center;
`;

const CreateModeratorButton = props => (
  <ModeratorButton onClick={props.createModerator}>add moderator</ModeratorButton>
);

export default CreateModeratorButton;
