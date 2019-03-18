import React from 'react';
import styled from 'styled-components/macro';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { link } from '../../shared/helpers';
import Author from '../../shared/Author';

const Wrapper = styled.div`
  font-size: 13px;
  margin-top: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  & > * {
    margin-right: 4px;
  }

  & > a {
    ${link};
  }

  & > span {
    color: ${props => props.theme.mutedText};
  }
`;

const PostContentDetail = props => (
  <Wrapper>
    <Link to={`/p/${props.postAddress}`}>
      {props.commentCount} comment{props.commentCount !== 1 ? 's' : null}
    </Link>
    <Link to={`/f/${props.forumAddress}`}>/f/{props.forumName}</Link>
    <span>by</span>
    <Author username={props.creator} />
    <span>{moment(props.time).fromNow()}</span>
  </Wrapper>
);

export default PostContentDetail;
