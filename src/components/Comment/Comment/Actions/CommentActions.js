import React from 'react';
import styled from 'styled-components/macro';
import Save from './Save';
import Unsave from './Unsave';
import Tip from './Tip';
import Delete from './Delete';
import Report from './Report';
import Comment from './Comment';
import { Link } from 'react-router-dom';
import ChildArrow from '../../../Buttons/ChildArrow';
import UnfocusButton from '../../../Buttons/Unfocus';

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
      <ButtonWrapper
        onClick={() => props.handleReply(props.comment.args.commentId)}
      >
        <Comment size={16} />
        {' Reply'}
      </ButtonWrapper>
      {!props.saved ? (
        <ButtonWrapper
          onClick={() => props.handleSave(props.comment.args.commentId)}
        >
          <Save size={16} />
          {'Save'}
        </ButtonWrapper>
      ) : (
        <ButtonWrapper
          onClick={() => props.handleUnsave(props.comment.args.commentId)}
        >
          <Unsave size={16} />
          {'Unsave'}
        </ButtonWrapper>
      )}
      <Link to={`/u/${props.comment.args.creator}/tip`} style={{ textDecoration: 'none' }}>
        <ButtonWrapper>
          <Tip />
          {'Tip'}
        </ButtonWrapper>
      </Link>
      {props.canDelete ? (
        <ButtonWrapper onClick={props.handleDelete}>
          <Delete size={16} />
          {'Delete'}
        </ButtonWrapper>
      ) : null}
      <Link
        to={`/f/${props.forumName}/p/${props.comment.args.postId}/c/${
          props.comment.args.commentId
        }/report`}
        style={{ textDecoration: 'none' }}
      >
        <ButtonWrapper>
          <Report size={16} />
          {'Report'}
        </ButtonWrapper>
      </Link>
    </ActionWrapper>

    <ActionWrapper>
      {props.comments > 0 ? (
        <ButtonWrapper onClick={() => props.handleFocus(props.comment)}>
          {props.focused ? (
            <UnfocusButton size={14} />
          ) : (
            <ChildArrow size={14} />
          )}
          {props.comments} comment
          {props.comments !== 1 ? 's' : null}
        </ButtonWrapper>
      ) : null}
    </ActionWrapper>
  </Wrapper>
);

export default CommentActions;
