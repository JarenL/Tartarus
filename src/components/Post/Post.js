import React from 'react';
import styled from 'styled-components/macro';
import PostVote from './Vote/Component';
import PostContent from './Content';

const Wrapper = styled.div`
  display: flex;
  height: auto;
  background-color: ${props => props.theme.foreground};
`;

const Post = props => (
  <Wrapper>
    <PostVote
      votes={props.votes}
      loading={props.voteLoading}
      handleUpvote={props.handleUpvote}
      handleDownvote={props.handleDownvote}
    />
    <PostContent
      loading={props.loading}
      showFullPost={props.showFullPost}
      type={props.type}
      postId={props.postId}
      title={props.title}
      post={props.post}
      time={props.time}
      creator={props.creator}
      forumName={props.forumName}
      commentCount={props.comments}
      canDelete={props.canDelete}
      saved={props.saved}
      handleSave={props.handleSave}
      handleUnsave={props.handleUnsave}
      handleDelete={props.handleDelete}
    />
  </Wrapper>
);

export default Post;
