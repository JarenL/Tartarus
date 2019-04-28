import React from 'react';
import styled from 'styled-components/macro';
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from 'react-html-parser';
import LoadingBubble from '../shared/LoadingIndicator/Bubble';

const Wrapper = styled.div`
  overflow-wrap: break-word;
  list-style-position: inside;
  padding: 8px;
  font-size: 14px;
  color: ${props => props.theme.mutedText};
`;

const CommentContent = props => {
  if (props.loading) {
    return <LoadingBubble />;
  } else {
    return <Wrapper>{ReactHtmlParser(props.comment)}</Wrapper>;
  }
};

export default CommentContent;
