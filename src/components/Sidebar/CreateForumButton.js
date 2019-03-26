import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import Button from '../shared/Button';

const CreateForumButton = styled(Button)`
  border-radius: 2px 2px 0 0;
  padding: 16px;
  text-decoration: none;
  text-align: center;
`;

const SidebarCreateForumButton = props => (
  <CreateForumButton as={Link} to={`/createforum`}>
    create forum
  </CreateForumButton>
);

export default SidebarCreateForumButton;
