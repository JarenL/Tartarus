import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import Button from '../../shared/Button';

const ForumButton = styled(Button)`
  border-radius: 2px 2px 0 0;
  padding: 16px;
  text-decoration: none;
  text-align: center;
`;

const CreateForumButton = props => (
  <ForumButton as={Link} to={`/createforum`}>
    create forum
  </ForumButton>
);

export default CreateForumButton;
