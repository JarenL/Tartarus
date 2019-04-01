import React from 'react';
import styled from 'styled-components/macro';
import Markdown from '../../shared/Markdown';
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from 'react-html-parser';

const Wrapper = styled.div`
  margin: 8px -8px;
  border: 1px solid ${props => props.theme.border};
  border-left: none;
  border-right: none;
  padding: 8px;
  background-color: ${props => props.theme.inputBackground};
`;

const StyledText = styled.div`
  color: ${props => props.theme.normalText};
  font-size: 15px;
  line-height: 1.5;

  p,
  ol,
  ul,
  pre,
  table {
    margin-bottom: 0.5em;
  }

  code {
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier,
      monospace;
    font-size: 14px;
    line-height: 1.25;
  }

  > :last-child {
    margin-bottom: 0;
  }

  > :first-child {
    margin-top: 0;
  }
`;

const PostContentFullText = props => (
  <Wrapper>
    <StyledText>{ReactHtmlParser(props.children)}</StyledText>
  </Wrapper>
);

export default PostContentFullText;
