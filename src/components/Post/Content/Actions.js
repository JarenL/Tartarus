import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { link } from '../../shared/helpers';

import { ifNotProp, prop } from 'styled-tools';
import Delete from './Buttons/Delete';
import Report from './Buttons/Report';
import Comment from './Buttons/Comment';
import More from './Buttons/More';
import Less from './Buttons/Less';
import Save from './Buttons/Save';
import Unsave from './Buttons/Unsave';
import Tip from './Buttons/Tip';

const Wrapper = styled.div`
  display: flex;
  flexgrow: 1;
  justifycontent: 'center';
  alignitems: 'center';
  font-size: 14px;
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

const ButtonWrapper = styled.span`
  cursor: pointer;
  color: ${props => props.theme.mutedText};
  & > svg {
    margin-right: 5px;
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

const PostActions = props => (
  <Wrapper>
    {console.log(props.canDelete)}
    <ButtonWrapper>
      {!props.preview ? (
        <More size={16} onClick={props.handlePreview} />
      ) : (
        <Less size={16} onClick={props.handlePreview} />
      )}
    </ButtonWrapper>
    <Link to={`/p/${props.postId}`}>
      <ButtonWrapper>
        <Comment size={16} /> 
        {" "}{props.commentCount} comment{props.commentCount !== 1 ? 's' : null}
      </ButtonWrapper>
    </Link>
    {!props.saved ? (
      <ButtonWrapper onClick={() => props.handleSave(props.postId)}>
        <Save size={16} />
        {'Save'}
      </ButtonWrapper>
    ) : (
      <ButtonWrapper onClick={() => props.handleUnsave(props.postId)}>
        <Unsave size={16} />
        {'Unsave'}
      </ButtonWrapper>
    )}
    <ButtonWrapper>
      <Tip />
      {'Tip'}
      </ButtonWrapper>
    {props.canDelete ? (
      <ButtonWrapper onClick={props.handleDelete}>
        <Delete size={16} />
        {'Delete'}
      </ButtonWrapper>
    ) : null}
    <ButtonWrapper>
      <Report size={16} />
      {'Report'}
    </ButtonWrapper>
  </Wrapper>
);

export default PostActions;
