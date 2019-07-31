import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import Button from '../shared/Button';

const MessageButton = styled(Button)`
  border-radius: 2px 2px 2px 2px;
  padding: 16px;
  margin: 4px;
  text-decoration: none;
  text-align: center;
`;

const UserMessageButton = () => (
  <MessageButton as={Link} to='/message'>
    send message
  </MessageButton>
);

export default UserMessageButton;
