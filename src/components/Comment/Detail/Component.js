import React from 'react';
import styled from 'styled-components/macro';
import Author from '../../shared/Author';
import CommentDetailTimestamp from './Timestamp';
import DeleteButton from '../../shared/DeleteButton';

const Wrapper = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 8px;
  font-size: 13px;
`;

class CommentDetail extends React.Component {
  // deleteComment = () => this.props.attemptDeleteComment(this.props.id);

  render() {
    return (
      <Wrapper>
        <Author username={this.props.username} />
        <CommentDetailTimestamp created={this.props.time} />
        {/* {this.props.token &&
          (this.props.user.id === this.props.author.id ||
            this.props.user.admin) && ( */}
        <DeleteButton />
        {/* )} */}
      </Wrapper>
    );
  }
}

export default CommentDetail;
