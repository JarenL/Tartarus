import React, { Component } from 'react';
import CommentList from './CommentList';
import { connect } from 'react-redux';
import PostContract from '../../../build/contracts/Post.json';

import SelectCommentSort from '../Select/SelectCommentSort'

class CommentListContainer extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      comments: [],
      loading: true,
      sorting: 'newest'
    }
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const post = contract(PostContract)
    post.setProvider(this.props.web3.currentProvider)
    post.at(this.props.currentPostAddress).then((instance) => {
      const commentCreationEvent = instance.allEvents({ fromBlock: 0, toBlock: 'latest' });
      commentCreationEvent.watch((error, result) => {
        if (!error) {
          if (result.event === "CommentCreated") {
            let newCommentArray = this.state.comments.slice();
            newCommentArray.push({
              address: result.args.commentAddress
            });
            this.setState({
              comments: newCommentArray
            });
          }
        }
      })
    })
  }

  render() {
    return (
      <div>
        <SelectCommentSort/>
        {(() => {
          if (this.props.commentSorting == "newest") {
            return (
              <div><CommentList comments={this.state.comments} /></div>
            )
          } else if (this.props.commentSorting == "oldest") {
            return (
              <div><CommentList comments={this.state.comments.reverse()} /></div>
            )
          } else {
            return (
              <div><CommentList comments={this.state.comments} /></div>
            )
          }
        })()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    web3: state.web3,
    currentPostAddress: state.forum.currentPostAddress,
    commentSorting: state.SelectCommentSort
  };
}

export default connect(mapStateToProps)(CommentListContainer);
