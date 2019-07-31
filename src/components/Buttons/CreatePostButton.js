import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import Button from '../shared/Button';

const PostButton = styled(Button)`
  border-radius: 2px 2px 0 0;
  padding: 16px;
  text-decoration: none;
  text-align: center;
`;

const CreatePostButton = props => {
  if (props.username) {
    return (
      <PostButton as={Link} to={`/f/${props.forumName}/createpost`}>
        create post
      </PostButton>
    );
  } else {
    return (
      <PostButton as={Link} to={`/login`}>
        create post
      </PostButton>
    );
  }
};

export default CreatePostButton;
