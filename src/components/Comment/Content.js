import React from 'react';
import styled from 'styled-components/macro';
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from 'react-html-parser';

const Wrapper = styled.div`
  // margin: 8px -8px;
  overflow-wrap: break-word;
  border: 1px solid ${props => props.theme.border};
  border-left: none;
  list-style-position: inside;
  padding: 8px;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.mutedText};
`;

const CommentContent = props => (
  <Wrapper>{ReactHtmlParser(props.comment)}</Wrapper>
);

export default CommentContent;
