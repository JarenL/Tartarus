import React from 'react';
import styled from 'styled-components/macro';
import Save from './Save';
import Unsave from './Unsave';
import Tip from './Tip';
import Delete from './Delete';
import Report from './Report';
import Comment from './Comment';

const Wrapper = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 8px;
  font-size: 13px;
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
    <ButtonWrapper>
      <Comment size={16} /> {5} comment
      {5 !== 1 ? 's' : null}
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

export default CommentActions;
