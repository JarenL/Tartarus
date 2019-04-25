import React, { Component } from 'react';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';
import Empty from '../shared/Empty';
import PostDetailPost from './Post';
import CommentFormContainer from '../CreateCommentForm/Container';
import PostDetailCommentSection from './CommentSection';
import TartarusContract from '../../contracts/Tartarus.json';
import PostContainer from '../Post/PostContainer';

class PostDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      post: null,
      exists: true,
      showCommentForm: false
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract() {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance
          .PostCreated(
            {
              postId: this.props.postId
            },
            {
              fromBlock: 0,
              toBlock: 'latest'
            }
          )
          .get((error, post) => {
            if (
              post[0].args.creator ===
              '0x0000000000000000000000000000000000000000000000000000000000000000'
            ) {
              this.setState({
                exists: false,
                loading: false
              });
            } else {
              instance
                .CommentCreated(
                  {
                    postId: this.props.postId
                  },
                  {
                    fromBlock: 0,
                    toBlock: 'latest'
                  }
                )
                .get((error, comments) => {
                  this.setState({
                    comments: comments,
                    post: post[0],
                    loading: false
                  });
                  console.log(comments);
                });
            }
          });
      });
    });
  }

  handleReply = props => {
    this.setState({
      currentComment: props
    });
  };

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.exists) return <Empty />;
    return (
      <>
        <PostContainer post={this.state.post.args} showFullPost={true} />
        <CommentFormContainer
          postId={this.props.postId}
          forumName={this.props.forumName}
          targetId={this.props.postId}
        />
        <PostDetailCommentSection
          forumName={this.props.forumName}
          comments={this.state.comments.reverse()}
        />
      </>
    );
  }
}

export default PostDetail;
