import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { link } from '../../../shared/helpers';

import { ifNotProp, prop } from 'styled-tools';
import Delete from '../../../Buttons/Delete';
import Report from '../../../Buttons/Report';
import Comment from '../../../Buttons/Comment';
import More from '../../../Buttons/More';
import Less from '../../../Buttons/Less';
import Save from '../../../Buttons/Save';
import Unsave from '../../../Buttons/Unsave';
import Tip from '../../../Buttons/Tip';
import Watch from '../../../Buttons/Watch';
import Unwatch from '../../../Buttons/Unwatch';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

const TextWrapper = styled.div`
  display: flex;
  @media (max-width: 425px) {
    display: none;
  }
`;

const CommentCountWrapper = styled.div`
  display: flex;
`;

const PostActions = props => (
  <Wrapper>
    <ButtonWrapper>
      {!props.preview ? (
        <More size={16} onClick={props.handlePreview} />
      ) : (
        <Less size={16} onClick={props.handlePreview} />
      )}
    </ButtonWrapper>
    <LinkWrapper
      to={`/f/${props.forumName}/p/${props.postId}`}
      style={{ textDecoration: 'none' }}
    >
      <Comment size={16} />
      <CommentCountWrapper>{props.commentCount}</CommentCountWrapper>
    </LinkWrapper>
    {!props.saved ? (
      <ButtonWrapper onClick={() => props.handleSave(props.postId)}>
        <Save size={16} />
        <TextWrapper>{'Save'}</TextWrapper>
      </ButtonWrapper>
    ) : (
      <ButtonWrapper onClick={() => props.handleUnsave(props.postId)}>
        <Unsave size={16} />
        <TextWrapper>{'Unsave'}</TextWrapper>
      </ButtonWrapper>
    )}
    {!props.watched ? (
      <ButtonWrapper onClick={() => props.handleWatch(props.postId)}>
        <Watch size={16} />
        <TextWrapper>{'Watch'}</TextWrapper>
      </ButtonWrapper>
    ) : (
      <ButtonWrapper onClick={() => props.handleUnwatch(props.postId)}>
        <Unwatch size={16} />
        <TextWrapper>{'Unwatch'}</TextWrapper>
      </ButtonWrapper>
    )}
    <ButtonWrapper>
      <Tip size={16} />
      <TextWrapper>{'Tip'}</TextWrapper>
    </ButtonWrapper>
    {props.canDelete ? (
      <ButtonWrapper onClick={props.handleDelete}>
        <Delete size={16} />
        <TextWrapper>{'Delete'}</TextWrapper>
      </ButtonWrapper>
    ) : null}
    <ButtonWrapper onClick={props.handleReport}>
      <Report size={16} />
      <TextWrapper>{'Report'}</TextWrapper>
    </ButtonWrapper>
  </Wrapper>
);

export default PostActions;
