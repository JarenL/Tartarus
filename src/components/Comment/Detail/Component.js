import React from 'react';
import styled from 'styled-components/macro';
import Author from '../../shared/Author';
import CommentDetailTimestamp from './Timestamp';
import DeleteButton from '../../shared/DeleteButton';

const Wrapper = styled.div`
  display: flex;
  padding: 4px;
  font-size: 13px;
`;

class CommentDetail extends React.Component {
  // deleteComment = () => this.props.attemptDeleteComment(this.props.id);

  render() {
    return (
      <Wrapper>
        <Author username={this.props.creator} />
        <CommentDetailTimestamp created={this.props.time} />
      </Wrapper>
    );
  }
}

export default CommentDetail;
