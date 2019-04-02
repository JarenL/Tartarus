import React from 'react';
import styled from 'styled-components/macro';
import PostVoteContainer from './Vote/Component';
import PostContent from './Content';

const Wrapper = styled.div`
  display: flex;
  height: auto;
  background-color: ${props => props.theme.foreground};
`;

const Post = props => (
  <Wrapper>
    <PostVoteContainer
      address={props.address}
      votes={props.votes}
      score={props.votes}
      loading={props.loading}
    />
    <PostContent
      loading={props.loading}
      postAddress={props.address}
      showFullPost={props.showFullPost}
      type={props.type}
      id={props.address}
      title={props.title}
      post={props.post}
      time={props.time}
      creator={props.creator}
      forumName={props.forumName}
      forumAddress={props.forum}
      commentCount={props.comments}
    />
  </Wrapper>
);

export default Post;
