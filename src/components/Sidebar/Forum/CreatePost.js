import React from 'react';
import styled from 'styled-components/macro';
import Button from '../../shared/Button';

const PostButton = styled(Button)`
  border-radius: 2px 2px 0 0;
  padding: 16px;
  text-decoration: none;
  text-align: center;
`;

const CreatePostButton = props => (
  <PostButton onClick={props.createPostHandler}>create post</PostButton>
);

export default CreatePostButton;
