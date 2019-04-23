import React from 'react';
import styled from 'styled-components/macro';
import CommentListItem from './Item';

const List = styled.ul`
  margin-top: 16px;
  list-style: none;
`;

const mapComments = props =>
  props.comments.map((comment, index) => (
    <CommentListItem key={index} forumName={props.forumName} comment={comment.args} />
  ));

// const sortComments = comments =>
//   comments.sort((a, b) => new Date(b.created) - new Date(a.created));

const CommentList = props => (
  // comments && <List>{mapComments(sortComments(comments))}</List>;
  <List>{mapComments(props)}</List>
);

export default CommentList;
