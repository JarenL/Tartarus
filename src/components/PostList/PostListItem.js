import React from 'react';
import styled from 'styled-components/macro';
import PostContainer from '../Post/PostContainer';

const Item = styled.li`
  list-style-type: none;
  :not(:first-child) {
    border-top: 1px solid ${props => props.theme.border};
  }
`;

const PostListItem = props => (
  <Item>
    <PostContainer {...props} />
  </Item>
);

export default PostListItem;
