import React from 'react';
import styled from 'styled-components/macro';
import Author from '../../../shared/Author';
import CommentDetailTimestamp from './Timestamp';
import ParentArrow from '../../../Buttons/RightArrow';
import { wideFont } from '../../../shared/helpers';
import { overflow } from '../../../shared/helpers';
import { link } from '../../../shared/helpers';

const Wrapper = styled.div`
  display: flex;
  padding: 4px;
  justify-content: space-between;
`;

const ButtonWrapper = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
  text-transform: uppercase;
  display: flex;
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

const UserWrapper = styled.div`
  font-size: 12px;
  display: flex;
  flex-direction: row;
  margin-top: auto;
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

class CommentDetail extends React.Component {
  render() {
    return (
      <Wrapper>
        <UserWrapper>
          <Author
            username={this.props.creator}
            isModerator={this.props.isModerator}
            isAdmin={this.props.isAdmin}
            creatorHex={this.props.creatorHex}
          />
          <CommentDetailTimestamp created={this.props.time} />
        </UserWrapper>
        {this.props.postId !== this.props.targetId && !this.props.disabled ? (
          <ButtonWrapper
            onClick={() => this.props.handleScroll(this.props.index)}
            onMouseEnter={() =>
              this.props.handleParentHover(this.props.targetId)
            }
            onMouseLeave={() => this.props.handleParentHover(null)}
          >
            <ParentArrow size={16} />
            {/* {this.props.targetId} */}
          </ButtonWrapper>
        ) : null}
      </Wrapper>
    );
  }
}

export default CommentDetail;
