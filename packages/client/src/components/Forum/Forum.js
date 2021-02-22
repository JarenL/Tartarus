import React from 'react';
import styled from 'styled-components/macro';
import ForumContent from './Content';

const Wrapper = styled.div`
  display: flex;
  height: auto;
  background-color: ${props => props.theme.foreground};
`;

const Forum = ({
  address,
  // title,
  // post,
  // creator,
  // time,
  // votes,
  // forum,
  name
  // comments
}) => (
  <Wrapper>
    <ForumContent
      name={name}
      // showFullPost={full}
      // id={address}
      // title={title}
      // post={post}
      // time={time}
      // creator={creator}
      // forumName={forumName}
      // forumAddress={forum}
      // commentCount={comments}
    />
  </Wrapper>
);

export default Forum;
