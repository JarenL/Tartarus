import React from 'react';
import styled from 'styled-components/macro';
import Author from '../../shared/Author';
import CommentDetailTimestamp from './Timestamp';
import ParentArrow from '../../Buttons/RightArrow';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';

const Wrapper = styled.div`
  display: flex;
  padding: 4px;
  font-size: 13px;
  justify-content: space-between;
`;

const ButtonWrapper = styled.span`
  text-transform: uppercase;
  display: flex;
  font-size: 10px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: ${props => props.theme.mutedText};
  border: none;
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

class CommentDetail extends React.Component {
  render() {
    return (
      <Wrapper>
        <div>
          <Author username={this.props.creator} />
          <CommentDetailTimestamp created={this.props.time} />
        </div>
        {this.props.postId !== this.props.targetId ? (
          <ButtonWrapper onClick={() => this.props.handleScroll(this.props.index)}>
            <ParentArrow size={14} />
            {this.props.targetId}
          </ButtonWrapper>
        ) : null}
      </Wrapper>
    );
  }
}

export default CommentDetail;
