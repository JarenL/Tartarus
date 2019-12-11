import React from 'react';
import styled from 'styled-components/macro';
import PostContainer from '../Post/Container';

const Item = styled.li`
  list-style-type: none;
  margin-bottom: 8px;
  @media (max-width: 768px) {
    margin-bottom: 0px;
  }
`;

const PostListItem = props => (
  <Item>
    <PostContainer post={props.post} forumPinned={props.forumPinned} />
  </Item>
);

export default PostListItem;
