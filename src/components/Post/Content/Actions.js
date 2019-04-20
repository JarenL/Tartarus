import React from 'react';
import styled from 'styled-components/macro';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { link } from '../../shared/helpers';
import Author from '../../shared/Author';

import { ifNotProp, prop } from 'styled-tools';
import DeleteButton from '../../Sidebar/Buttons/DeleteButton';
import ReportButton from '../../Sidebar/Buttons/ReportButton';
import Comment from './Icons/Comment';
import More from './Icons/More';
import Less from './Icons/Less';
import Save from './Icons/Save';
import Unsave from './Icons/Unsave';
import Tip from './Icons/Tip';

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
      <i class="fab fa-ethereum"></i>
      {'Tip'}
      </ButtonWrapper>
    {props.canDelete ? (
      <ButtonWrapper onClick={props.handleDelete}>
        <DeleteButton size={16} />
        {'Delete'}
      </ButtonWrapper>
    ) : null}
    <ButtonWrapper>
      <ReportButton size={16} />
      {'Report'}
    </ButtonWrapper>
  </Wrapper>
);

export default PostActions;
