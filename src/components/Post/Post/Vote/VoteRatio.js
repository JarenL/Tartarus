import React from 'react';
import styled from 'styled-components/macro';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 1px;
  height: auto;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const UpvoteRatio = styled.div`
  display: flex;
  height: ${props => props.upvoteRatio}%;
  width: 100%;
  background-color: ${props => props.theme.upvote};
`;

const DownvoteRatio = styled.div`
  display: flex;
  height: ${props => 100 - props.upvoteRatio}%;
  width: 100%;
  background-color: ${props => props.theme.downvote};
`;

const RatioDivider = styled.div`
  display: flex;
  height: 1px;
  width: 100%;
  // background-color: ${props => props.theme.mutedText};
`;

const VoteRatio = props => {
  console.log(props)
  return (
    <Wrapper>
      <UpvoteRatio upvoteRatio={props.upvoteRatio} />
      {props.upvoteRatio > 0 ? <RatioDivider /> : null}
      <DownvoteRatio upvoteRatio={props.upvoteRatio} />
    </Wrapper>
  );
};

export default VoteRatio;
