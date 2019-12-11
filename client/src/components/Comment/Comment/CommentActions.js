import React from 'react';
import styled from 'styled-components/macro';
import Save from '../../Buttons/Save';
import Unsave from '../../Buttons/Unsave';
import Tip from '../../Buttons/Tip';
import Delete from '../../Buttons/Delete';
import Report from '../../Buttons/Report';
import Comment from '../../Buttons/Comment';
import { Link } from 'react-router-dom';
import ChildArrow from '../../Buttons/ChildArrow';
import UnfocusButton from '../../Buttons/Unfocus';
import Watch from '../../Buttons/Watch';
import Unwatch from '../../Buttons/Unwatch';
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';
import BanButton from '../../Buttons/Ban';

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
    <ReactPlaceholder
      delay={1000}
      color={props.dark ? '#1b1b1b' : '#f4f6f8'}
      showLoadingAnimation={true}
      rows={1}
      ready={!props.loading}
    >
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
        {!props.watched ? (
          <ButtonWrapper
            onClick={() => props.handleWatch(props.comment.args.commentId)}
          >
            <Watch size={16} />
            <TextWrapper>{'Watch'}</TextWrapper>
          </ButtonWrapper>
        ) : (
          <ButtonWrapper
            onClick={() => props.handleUnwatch(props.comment.args.commentId)}
          >
            <Unwatch size={16} />
            <TextWrapper>{'Unwatch'}</TextWrapper>
          </ButtonWrapper>
        )}
        {/* <LinkWrapper
        to={`/u/${props.comment.args.creator}/tip`}
        style={{ textDecoration: 'none' }}
      >
        <Tip size={16} />
        <TextWrapper>{'Tip'}</TextWrapper>
      </LinkWrapper> */}
        {props.canDelete && !props.deleted ? (
          <ButtonWrapper onClick={props.handleDelete}>
            <Delete size={16} />
            <TextWrapper>{'Delete'}</TextWrapper>
          </ButtonWrapper>
        ) : null}
        {props.canBan ? (
          <ButtonWrapper onClick={props.handleBan}>
            <BanButton size={16} />
            <TextWrapper>{'Ban'}</TextWrapper>
          </ButtonWrapper>
        ) : null}
        <LinkWrapper
          to={`/f/${props.forumName}/p/${props.comment.args.postId}/c/${props.comment.args.commentId}/report`}
          style={{ textDecoration: 'none' }}
        >
          <Report size={16} />
          <TextWrapper>{'Report'}</TextWrapper>
        </LinkWrapper>
      </ActionWrapper>

      <ActionWrapper>
        {props.comments > 0 && !props.disabled ? (
          <ButtonWrapper onClick={() => props.handleFocus(props.comment)}>
            {props.comments}
            {props.focused ? (
              <UnfocusButton size={16} />
            ) : (
              <ChildArrow size={16} />
            )}
          </ButtonWrapper>
        ) : null}
      </ActionWrapper>
    </ReactPlaceholder>
  </Wrapper>
);

export default CommentActions;
