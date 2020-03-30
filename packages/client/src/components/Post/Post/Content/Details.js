import React from 'react';
import styled from 'styled-components/macro';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { link } from '../../../shared/helpers';
import Author from '../../../shared/Author';
import PinButton from '../../../Buttons/PinButton';
import UnpinButton from '../../../Buttons/UnpinButton';
import LockButton from '../../../Buttons/LockButton';
import UnlockButton from '../../../Buttons/UnlockButton';

const Wrapper = styled.div`
  font-size: 12px;
  display: flex;
  flex-direction: row;
  margin-top: auto;
  margin-bottom: 4px;;
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

const AdminPin = styled(UnpinButton)`
  color: ${props => props.theme.admin};
`;

const ModPin = styled(UnpinButton)`
  color: ${props => props.theme.mod};
`;

const UserPin = styled(PinButton)`
  color: ${props => props.theme.accent};
`;

const AdminLock = styled(UnlockButton)`
  color: ${props => props.theme.admin};
`;

const ModLock = styled(UnlockButton)`
  color: ${props => props.theme.mod};
`;

const UserLock = styled(LockButton)`
  color: ${props => props.theme.accent};
`;

const PostContentDetail = props => {
  return (
    <Wrapper id={"details"}>
      <Link to={`/f/${props.forumName}`} style={{ textDecoration: 'none' }}>
        /f/{props.forumName}
      </Link>
      <span>by</span>
      <Author
        username={props.creator}
        creatorHex={props.creatorHex}
        isModerator={props.isModerator}
        isAdmin={props.isAdmin}
      />
      <span>{moment(props.time).fromNow()}</span>
      {props.adminPinned ? (
        props.canPin ? (
          <AdminPin size={16} onClick={() => props.handleUnpin()} />
        ) : (
          <AdminPin size={16} />
        )
      ) : props.forumPinned ? (
        props.canPin ? (
          <ModPin size={16} onClick={() => props.handleUnpin()} />
        ) : (
          <ModPin size={16} />
        )
      ) : props.canPin ? (
        <UserPin size={16} onClick={() => props.handlePin()} />
      ) : null}
      {props.isLocked === 0 ? (
        props.canLock ? (
          <UserLock size={16} onClick={() => props.handleLock()} />
        ) : null
      ) : props.isLocked === 1 ? (
        props.canLock ? (
          <ModLock size={16} onClick={() => props.handleUnlock()} />
        ) : (
          <ModLock size={16} />
        )
      ) : props.canLock ? (
        <AdminLock size={16} onClick={() => props.handleUnlock()} />
      ) : (
        <AdminLock size={16} />
      )}
    </Wrapper>
  );
};

export default PostContentDetail;
