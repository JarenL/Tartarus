import React from 'react';
import styled from 'styled-components/macro';
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from 'react-html-parser';
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';
import { TextRow } from 'react-placeholder/lib/placeholders';

const Wrapper = styled.div`
  overflow-wrap: break-word;
  list-style-position: inside;
  padding: 8px;
  font-size: 14px;
  color: ${props => props.theme.mutedText};
`;

const CommentContent = props => {
  console.log(ReactHtmlParser(props.comment))
  return (
    <Wrapper>
      <ReactPlaceholder
        delay={1000}
        color={props.dark ? '#1b1b1b' : '#f4f6f8'}
        showLoadingAnimation={true}
        rows={1}
        ready={!props.loading}
      >
        {ReactHtmlParser(props.comment)}
      </ReactPlaceholder>
    </Wrapper>
  );
};

export default CommentContent;
