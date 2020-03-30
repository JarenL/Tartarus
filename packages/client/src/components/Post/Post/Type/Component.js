import React from 'react';
import styled from 'styled-components/macro';
import { MdLink } from 'react-icons/md';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  padding: 4px;
  font-size: 12px;
  line-height: 25px;
  font-weight: 500;
  text-align: center;
  color: ${props => props.theme.normalText};
  border-left: 1px solid ${props => props.theme.border};
  border-top: 5px solid;
  border-image:   linear-gradient(to right, grey 25%, yellow 25%, yellow 50%,red 50%, red 75%, teal 75%) 5;
}
`;

const UpvoteScoreWrapper = styled.span`
  color: ${props => props.theme.upvote};
`;

const DownvoteScoreWrapper = styled.span`
  color: ${props => props.theme.downvote};
`;

const PostType = props => {
  if (props.loading) {
    return null;
  } else {
    return (
      <Wrapper>
        <MdLink size={24} />
      </Wrapper>
    );
  }
};

export default PostType;
