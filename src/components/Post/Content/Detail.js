import React from 'react';
import styled from 'styled-components/macro';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { link } from '../../shared/helpers';
import Author from '../../shared/Author';

import { ifNotProp, prop } from 'styled-tools';
import {
  MdUnfoldMore,
  MdUnfoldLess,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
  MdModeComment
} from 'react-icons/md';

export const ActionItem = styled.span`
  // vertical-align: sub;
  cursor: pointer;
  // color: ${prop('color', '#000')};
  // & > svg {
  //   margin-right: 5px;
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

const Wrapper = styled.div`
  display: flex;
  flexgrow: 1;
  justifycontent: 'center';
  alignitems: 'center';
  font-size: 13px;
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

const PostContentDetail = props => (
  <Wrapper>
    {props.type !== 'text' && (
      <ActionItem>
        {!props.preview ? (
          <MdUnfoldMore size={18} onClick={props.handlePreview} />
        ) : (
          <MdUnfoldLess size={18} onClick={props.handlePreview} />
        )}
      </ActionItem>
    )}
    <Link to={`/p/${props.postAddress}`}>
      {props.commentCount} comment{props.commentCount !== 1 ? 's' : null}
    </Link>
    <Link to={`/f/${props.forumAddress}`}>/f/{props.forumName}</Link>
    <span>by</span>
    <Author username={props.creator} />
    <span>{moment(props.time).fromNow()}</span>
  </Wrapper>
);

export default PostContentDetail;
