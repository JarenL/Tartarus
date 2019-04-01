import React from 'react';
import styled from 'styled-components/macro';
import PostVoteContainer from '../Post/Vote/Component';
import PostContent from '../Post/Content';

const Wrapper = styled.div`
  display: flex;
  height: auto;
  background-color: ${props => props.theme.foreground};
`;

const PostDetailPost = props => (
  <Wrapper>
    <PostVoteContainer
      id={props.postAddress}
      votes={props.votes}
      score={props.votes}
    />
    <PostContent
      postAddress={props.postAddress}
      showFullPost={true}
      type={'text'}
      post={props.post}
      id={props.postAddress}
      title={props.title}
      time={props.time}
      creator={props.creator}
      forumName={props.forumName}
      forumAddress={props.forumAddress}
      commentCount={props.commentCount}
    />{' '}
  </Wrapper>
);

export default PostDetailPost;
