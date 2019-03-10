import React, { Component } from 'react';
import CommentList from './CommentList';
import { connect } from 'react-redux';
import PostContract from '../../../contracts/Post.json';
import SelectCommentSort from './Select/SelectCommentSort'
import Grid from '@material-ui/core/Grid'

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
      if (this.props.currentPage === "Comment") {
        instance.CommentCreated({ targetAddress: this.props.currentCommentAddress }, { fromBlock: 0, toBlock: 'latest' }).get((error, result) => {
          console.log(result)
          this.setState({
            comments: result,
            loading: false
          });
        });
      }

      if (this.props.currentPage === "Post") {
        instance.CommentCreated({}, { fromBlock: 0, toBlock: 'latest' }).get((error, result) => {
          console.log(result)
          this.setState({
            comments: result,
            loading: false
          });
        });
      }
    })
  }

  render() {
    if (this.state.comments.length !== 0) {
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
    } else {
      return (
        <div>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '25vh' }}
          >            
            No comments
          </Grid>
        </div>
      )
    }

  }
}

const mapStateToProps = (state) => {
  return {
    web3: state.web3,
    currentPage: state.page.currentPage,
    currentPostAddress: state.forum.currentPostAddress,
    currentCommentAddress: state.forum.currentCommentAddress,
    commentSorting: state.comment.sorting
  };
}

export default connect(mapStateToProps)(CommentListContainer);
