import React from 'react';
import styled from 'styled-components/macro';
import Comment from '../Comment/Container';

const Item = styled.li`
  margin-bottom: 8px;
`;

const CommentListItem = props => (
  <Item>
    <Comment {...props} />
  </Item>
);

export default CommentListItem;
