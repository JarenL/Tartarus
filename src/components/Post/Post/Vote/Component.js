import React from 'react';
import styled from 'styled-components/macro';
import PostVoteUpvote from './Upvote';
import PostVoteDownvote from './Downvote';
import Loading from '../../../shared/LoadingIndicator/Loading';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30px;
  padding: 4px;
  font-size: 12px;
  line-height: 25px;
  font-weight: 500;
  text-align: center;
  color: ${props => props.theme.normalText};
`;

const PostVote = props => {
  if (props.loading) {
    return (
      <Wrapper>
        <Loading size={18} />
      </Wrapper>
    );
  } else {
    return (
      <Wrapper>
        <PostVoteUpvote didVote={false} onClick={props.handleUpvote} />
        <span>{props.votes}</span>
        <PostVoteDownvote didVote={false} onClick={props.handleDownvote} />
      </Wrapper>
    );
  }
};

export default PostVote;
