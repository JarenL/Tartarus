import React from 'react';
import styled from 'styled-components/macro';
import Save from './Save';
import Unsave from './Unsave';
import Tip from './Tip';
import Delete from './Delete';
import Report from './Report';
import Comment from './Comment';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  // padding: 4px;
  padding-right: 2px;
  padding-bottom: 2px;
  font-size: 13px;
`;

const ActionWrapper = styled.div`
  display: flex;
`;

const ButtonWrapper = styled.span`
  cursor: pointer;
  color: ${props => props.theme.mutedText};
  & > svg {
    margin-right: 3px;
    margin-left: 5px;
  }
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    color: ${props => props.theme.accent};
    & > svg {
      color: ${props => props.theme.accent} !important;
    }
  }
`;

const CommentActions = props => (
  <Wrapper>
    <ActionWrapper>
      <ButtonWrapper onClick={() => props.handleReply(props.commentId)}>
        <Comment size={16} />
        {' Reply'}
      </ButtonWrapper>
      {!props.saved ? (
        <ButtonWrapper onClick={() => props.handleSave(props.commentId)}>
          <Save size={16} />
          {'Save'}
        </ButtonWrapper>
      ) : (
        <ButtonWrapper onClick={() => props.handleUnsave(props.commentId)}>
          <Unsave size={16} />
          {'Unsave'}
        </ButtonWrapper>
      )}
      <Link to={`/u/${props.creator}/tip`} style={{ textDecoration: 'none' }}>
        <ButtonWrapper>
          <Tip />
          {'Tip'}
        </ButtonWrapper>
      </Link>
    </ActionWrapper>

    <ActionWrapper>
      {props.canDelete ? (
        <ButtonWrapper onClick={props.handleDelete}>
          <Delete size={16} />
          {'Delete'}
        </ButtonWrapper>
      ) : null}
      <Link
        to={`/f/${props.forumName}/p/${props.postId}/c/${
          props.commentId
        }/report`}
        style={{ textDecoration: 'none' }}
      >
        <ButtonWrapper>
          <Report size={16} />
          {'Report'}
        </ButtonWrapper>
      </Link>
    </ActionWrapper>
  </Wrapper>
);

export default CommentActions;
