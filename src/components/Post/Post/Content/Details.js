import React from 'react';
import styled from 'styled-components/macro';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { link } from '../../../shared/helpers';
import Author from '../../../shared/Author';

const Wrapper = styled.div`
  font-size: 12px;
  display: flex;
  flex-direction: row;
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

const PostContentDetail = props => {
  return (
    <Wrapper>
      <Link to={`/f/${props.forumName}`}>/f/{props.forumName}</Link>
      <span>by</span>
      <Author
        username={props.creator}
        creatorHex={props.creatorHex}
        isModerator={props.isModerator}
        isAdmin={props.isAdmin}
      />
      <span>{moment(props.time).fromNow()}</span>
    </Wrapper>
  );
};

export default PostContentDetail;
