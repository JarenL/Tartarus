import React from 'react';
import styled from 'styled-components/macro';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { link } from '../../../shared/helpers';
import Author from '../../../shared/Author';
import PinButton from '../../../Buttons/PinButton';
import UnpinButton from '../../../Buttons/UnpinButton';

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

const AdminWrapper = styled(UnpinButton)`
  color: ${props => props.theme.admin};
`;

const ModWrapper = styled(UnpinButton)`
  color: ${props => props.theme.mod};
`;

const UserWrapper = styled(PinButton)`
  color: ${props => props.theme.accent};
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
      {props.adminPinned ? (
        <AdminWrapper size={16} />
      ) : props.forumPinned ? (
        <ModWrapper size={16} onClick={() => props.handleUnpin()} />
      ) : props.canPin ? (
        <UserWrapper size={16} onClick={() => props.handlePin()} />
      ) : null}
    </Wrapper>
  );
};

export default PostContentDetail;
