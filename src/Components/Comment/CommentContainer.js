import React, { Component } from 'react';
import { connect } from 'react-redux';
import CommentContract from '../../../build/contracts/Comment.json';
import CircularProgress from '@material-ui/core/CircularProgress';
import Comment from './Comment';

class CommentContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comment: null,
      creator: null,
      post: null,
      forum: null,
      target: null,
      date: null,
      loading: true
    }
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const comment = contract(CommentContract)
    comment.setProvider(this.props.web3.currentProvider)
    comment.at(this.props.address).then((instance) => {
      instance.commentInfo.call().then((result) => {
        let commentDate = new Date(result[5].c[0] * 1000).toString()
        this.setState({
          comment: result[0],
          creator: result[1],
          target: result[4],
          date: commentDate,
          loading: false
        });
      })
    })
  }
  render() {
    if (this.state.loading) {
      return (
        <CircularProgress />
      )
    } else {
      return (
        <Comment
          address={this.props.address}
          comment={this.state.comment}
          creator={this.state.creator}
          target={this.state.target}
          date={this.state.date}
        />
      )
    }
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    accounts: state.accounts,
    tartarusAddress: state.tartarus.tartarusAddress,
  };
}

export default connect(mapStateToProps)(CommentContainer);

