import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';
import PostVoteUpvote from './Upvote';
import PostVoteDownvote from './Downvote';
import CommentContract from '../../../contracts/Comment.json';
import Loading from '../../Loading';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30px;
  padding: 4px;
  font-size: 12px;
  line-height: 25px;
  font-weight: 500;
  text-align: center;
  color: ${props => props.theme.normalText};
`;

class CommentVoteContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.upvote = this.upvote.bind(this);
  }

  upvote = () => {
    this.setState({
      loading: true
    });
    const contract = require('truffle-contract');
    const comment = contract(CommentContract);
    comment.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      comment.at(this.props.commentAddress).then(instance => {
        instance.upvote({ from: accounts[0], gasPrice: 20000000000 });
        this.setState({
          loading: false
        });
      });
    });
  };

  downvote = () => {
    this.setState({
      loading: true
    });
    const contract = require('truffle-contract');
    const comment = contract(CommentContract);
    comment.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      comment.at(this.props.commentAddress).then(instance => {
        instance.downvote({ from: accounts[0], gasPrice: 20000000000 });
        this.setState({
          loading: false
        });
      });
    });
  };

  render() {
    if (this.state.loading) {
      return (
        <Wrapper>
          <Loading size={25} />
        </Wrapper>
      );
    } else {
      return (
        <Wrapper>
          <div onClick={this.downvote}>
            <PostVoteUpvote didVote={false} />
          </div>
          <span>{this.props.votes}</span>
          <div onClick={this.downvote}>
            <PostVoteDownvote didVote={false} />
          </div>
        </Wrapper>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    accounts: state.accounts
  };
}

export default connect(mapStateToProps)(CommentVoteContainer);
