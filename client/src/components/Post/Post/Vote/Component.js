import React from 'react';
import styled from 'styled-components/macro';
import Upvote from '../../../Buttons/Upvote';
import Downvote from '../../../Buttons/Downvote';
import Loading from '../../../shared/LoadingIndicator/Loading';
import VoteRatio from './VoteRatio';

const VoteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 32px;
  padding: 4px;
  font-size: 12px;
  line-height: 25px;
  font-weight: 500;
  text-align: center;
  color: ${props => props.theme.normalText};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 34px;
  max-height: 90px;
`;

const StyledScore = styled.span`
  color: ${props =>
    props.upvoted
      ? props.theme.upvote
      : props.downvoted
      ? props.theme.downvote
      : props.theme.mutedText};
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
        <VoteWrapper>
          <Upvote
            size={28}
            upvoted={props.upvoted}
            onClick={() => props.handleVote(true)}
          />
          <StyledScore downvoted={props.downvoted} upvoted={props.upvoted}>
            {props.votes}
          </StyledScore>
          <Downvote
            size={28}
            downvoted={props.downvoted}
            onClick={() => props.handleVote(false)}
          />
        </VoteWrapper>
        <VoteRatio upvoteRatio={props.upvoteRatio} />
      </Wrapper>
    );
  }
};

export default PostVote;
