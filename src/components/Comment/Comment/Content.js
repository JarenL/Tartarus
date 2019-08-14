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

const textPlaceholder = (
  <div className='text-placeholder'>
    <TextRow color='#E0E0E0' />
  </div>
);

const CommentContent = props => {
  return (
    <Wrapper>
      <ReactPlaceholder
        delay={1000}
        showLoadingAnimation={true}
        ready={!props.loading}
        customPlaceholder={textPlaceholder}
      >
        {ReactHtmlParser(props.comment)}
      </ReactPlaceholder>
    </Wrapper>
  );
};

export default CommentContent;
