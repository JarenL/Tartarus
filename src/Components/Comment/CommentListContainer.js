import React, { Component } from 'react';
import CommentList from './CommentList';
import { connect } from 'react-redux';
import PostContract from '../../../build/contracts/Post.json';

class CommentListContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comments: [],
      sorting: 'newest',
      loading: true
    }
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  
  componentDidMount = () => {
    this.setState({
      sorting: this.props.sorting
    })
    this.instantiateContract();
  }

  componentDidUpdate = (newProps) => {
    if (this.props.sorting !== this.state.sorting) {
      console.log(newProps.sorting)
      this.setState({
        sorting: this.props.sorting
      })
    }
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
            <div><CommentList comments={this.state.comments} /></div>
          )
        }
}

const mapStateToProps = (state) => {
  return {
    web3: state.web3,
    currentPostAddress: state.forum.currentPostAddress,
    sorting : state.forum.sorting
  };
}

export default connect(mapStateToProps)(CommentListContainer);
