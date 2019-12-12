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
  border-left: none;
  padding-left: 8px;
  padding-right: 8px;
  font-size: 13px;
  // background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.mutedText};
`;

const PostContentFullText = props => (
  <Wrapper>{ReactHtmlParser(props.post)}</Wrapper>
);

export default PostContentFullText;
