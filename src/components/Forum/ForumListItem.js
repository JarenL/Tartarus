import React from 'react';
import styled from 'styled-components/macro';
import ForumContainer from './ForumContainer';

const Item = styled.li`
  :not(:first-child) {
    border-top: 1px solid ${props => props.theme.border};
  }
`;

const PostListItem = props => (
  <Item>
    <ForumContainer {...props} />
  </Item>
);

export default PostListItem;
