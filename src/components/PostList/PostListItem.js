import React from 'react';
import styled from 'styled-components/macro';
import PostContainer from '../Post/Post';

const Item = styled.li`
  list-style-type: none;
  margin-bottom: 8px;
  // :not(:first-child) {
  //   border-top: 1px solid ${props => props.theme.border};
  // }
`;

const PostListItem = props => (
  <Item>
    <PostContainer post={props.post} />
  </Item>
);

export default PostListItem;
