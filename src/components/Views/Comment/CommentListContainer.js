import React, { Component } from 'react';
import CommentList from './CommentList';
import { connect } from 'react-redux';
import PostContract from '../../../contracts/Post.json';
import SelectCommentSort from './Select/SelectCommentSort'

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

  componentDidUpdate(newProps) {
    console.log(newProps)
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const post = contract(PostContract)
    post.setProvider(this.props.web3.currentProvider)
    post.at(this.props.currentPostAddress).then((instance) => {
      instance.CommentCreated({}, { fromBlock: 0, toBlock: 'latest' }).get((error, result) => {
        console.log(result)
        this.setState({
          comments: result,
          loading: false
        });
      });
    })
  }

  render() {
    return (
      <div>
        {/* <SelectCommentSort/>
        {(() => {
          if (this.props.commentSorting === "newest") {
            console.log("ret a");
            return (
              
              <div><CommentList comments={this.state.comments} /></div>
            )
          } else if (this.props.commentSorting === "oldest") {
            console.log("ret b")
            return (
              <div><CommentList comments={this.state.comments.reverse()} /></div>
            )
          } else {
            console.log("ret c")
            return (
              <div><CommentList comments={this.state.comments} /></div>
            )
          }
        })()} */}
        <CommentList comments={this.state.comments} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    web3: state.web3,
    currentPostAddress: state.forum.currentPostAddress,
    commentSorting: state.comment.sorting
  };
}

export default connect(mapStateToProps)(CommentListContainer);
