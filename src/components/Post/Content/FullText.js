import React from 'react';
import styled from 'styled-components/macro';
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from 'react-html-parser';

const Wrapper = styled.div`
  margin: 8px -8px;
  overflow-wrap: break-word;
  border: 1px solid ${props => props.theme.border};
  border-left: none;
  padding: 8px;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.normalText};
`;

const PostContentFullText = props => (
  <Wrapper>{ReactHtmlParser(props.post)}</Wrapper>
);

export default PostContentFullText;
