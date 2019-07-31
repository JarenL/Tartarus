import React from 'react';
import styled from 'styled-components/macro';
import Save from '../../../Buttons/Save';
import Unsave from '../../../Buttons/Unsave';
import Tip from '../../../Buttons/Tip';
import Delete from '../../../Buttons/Delete';
import Report from '../../../Buttons/Report';
import Comment from '../../../Buttons/Comment';
import { Link } from 'react-router-dom';
import ChildArrow from '../../../Buttons/ChildArrow';
import UnfocusButton from '../../../Buttons/Unfocus';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  // padding: 4px;
  padding: 4px;
  // margin-left: 4px;
  font-size: 12px;
`;

const ActionWrapper = styled.div`
  display: flex;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  color: ${props => props.theme.mutedText};
  margin-right: 10px;
  // & > svg {
  //   margin-right: 3px;
  //   margin-left: 5px;
  // }
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

const TextWrapper = styled.div`
  display: flex;
  @media (max-width: 425px) {
    display: none;
  }
`;

const LinkWrapper = styled(Link)`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  color: ${props => props.theme.mutedText};
  margin-right: 10px;
  // & > svg {
  //   margin-right: 3px;
  //   margin-left: 5px;
  // }
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
        <TextWrapper>{' Reply'}</TextWrapper>
      </ButtonWrapper>
      {!props.saved ? (
        <ButtonWrapper
          onClick={() => props.handleSave(props.comment.args.commentId)}
        >
          <Save size={16} />
          <TextWrapper>{' Save'}</TextWrapper>
        </ButtonWrapper>
      ) : (
        <ButtonWrapper
          onClick={() => props.handleUnsave(props.comment.args.commentId)}
        >
          <Unsave size={16} />
          <TextWrapper>{' Unsave'}</TextWrapper>
        </ButtonWrapper>
      )}
      <LinkWrapper
        to={`/u/${props.comment.args.creator}/tip`}
        style={{ textDecoration: 'none' }}
      >
        <Tip size={16} />
        <TextWrapper>{'Tip'}</TextWrapper>
      </LinkWrapper>
      {props.canDelete ? (
        <ButtonWrapper onClick={props.handleDelete}>
          <Delete size={16} />
          <TextWrapper>{'Delete'}</TextWrapper>
        </ButtonWrapper>
      ) : null}
      <LinkWrapper
        to={`/f/${props.forumName}/p/${props.comment.args.postId}/c/${
          props.comment.args.commentId
        }/report`}
        style={{ textDecoration: 'none' }}
      >
        <Report size={16} />
        <TextWrapper>{'Report'}</TextWrapper>
      </LinkWrapper>
    </ActionWrapper>

    <ActionWrapper>
      {props.comments > 0 ? (
        <ButtonWrapper onClick={() => props.handleFocus(props.comment)}>
          {props.focused ? (
            <UnfocusButton size={16} />
          ) : (
            <ChildArrow size={16} />
          )}
        </ButtonWrapper>
      ) : null}
    </ActionWrapper>
  </Wrapper>
);

export default CommentActions;
