import React from 'react';
import styled from 'styled-components/macro';
import PostVoteContainer from './Vote/Component';
import PostContent from './Content';

const Wrapper = styled.div`
  display: flex;
  height: auto;
  background-color: ${props => props.theme.foreground};
`;

const Post = ({
  address,
  title,
  post,
  creator,
  time,
  votes,
  forum,
  forumName,
  comments
}) => (
  <Wrapper>
    <PostVoteContainer address={address} votes={votes} score={votes} />
    <PostContent
      postAddress={address}
      // showFullPost={full}
      id={address}
      title={title}
      post={post}
      time={time}
      creator={creator}
      forumName={forumName}
      forumAddress={forum}
      commentCount={comments}
    />
  </Wrapper>
);

export default Post;
