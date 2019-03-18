import React from 'react';
import styled from 'styled-components/macro';
import Markdown from '../shared/Markdown';

const Content = styled.div`
  padding: 12px;
`;

const CommentContent = props => (
  <Content>
    <Markdown>{props.comment}</Markdown>
  </Content>
);

export default CommentContent;
