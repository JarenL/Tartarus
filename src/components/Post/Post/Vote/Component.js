import React from 'react';
import styled from 'styled-components/macro';
import Upvote from '../../../Buttons/Upvote';
import Downvote from '../../../Buttons/Downvote';
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

const UpvoteScoreWrapper = styled.span`
  color: ${props => props.theme.upvote};
`;

const DownvoteScoreWrapper = styled.span`
  color: ${props => props.theme.downvote};
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
        <Upvote
          size={24}
          upvoted={props.upvoted}
          onClick={props.handleUpvote}
        />
        {props.upvoted || props.downvoted ? (
          props.upvoted ? (
            <UpvoteScoreWrapper>{props.votes}</UpvoteScoreWrapper>
          ) : (
            <DownvoteScoreWrapper>{props.votes}</DownvoteScoreWrapper>
          )
        ) : (
          <span>{props.votes}</span>
        )}
        <Downvote
          size={24}
          downvoted={props.downvoted}
          onClick={props.handleDownvote}
        />
      </Wrapper>
    );
  }
};

export default PostVote;
