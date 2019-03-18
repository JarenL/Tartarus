import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';
import Empty from '../shared/Empty';
import PostDetailPost from './Post';
// import PostDetailInfoBarContainer from './InfoBar/Container';
import CommentFormContainer from '../CommentForm/Container';
import PostDetailCommentSection from './CommentSection';
import ipfs from '../../services/ipfs/ipfs';
import PostContract from '../../contracts/Post.json';
import ForumContract from '../../contracts/Forum.json';
import PostDetailInfoBar from './InfoBar/Component';

class PostDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      creator: null,
      forumAddress: null,
      forumName: null,
      time: null,
      votes: 0,
      commentCount: 0,
      comments: null,
      loading: true,
      exists: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract() {
    const contract = require('truffle-contract');
    const post = contract(PostContract);
    const forum = contract(ForumContract);
    post.setProvider(this.props.web3.currentProvider);
    forum.setProvider(this.props.web3.currentProvider);
    post.at(this.props.postAddress).then(postInstance => {
      postInstance.postInfo.call().then(result => {
        postInstance.owner.call().then(owner => {
          forum.at(owner).then(forumInstance => {
            forumInstance.name.call().then(forumName => {
              postInstance
                .CommentCreated({}, { fromBlock: 0, toBlock: 'latest' })
                .get((error, comments) => {
                  ipfs.catJSON(result[0], (err, ipfsData) => {
                    if (ipfsData) {
                      this.setState({
                        title: ipfsData.title,
                        creator: result[1],
                        post: ipfsData.post,
                        forumAddress: owner,
                        forumName: forumName,
                        time: result[2].c[0] * 1000,
                        votes: result[3].c[0],
                        commentCount: comments.length,
                        comments: comments,
                        loading: false
                      });
                    } else {
                      this.setState({
                        exists: false
                      });
                    }
                  });
                });
            });
          });
        });
      });
    });
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.exists) return <Empty />;
    console.log(this.state);
    return (
      <>
        <PostDetailPost
          postAddress={this.props.postAddress}
          title={this.state.title}
          post={this.state.post}
          votes={this.state.votes}
          score={this.state.votes}
          forumName={this.state.forumName}
          forumAddress={this.state.forumAddress}
          time={this.state.time}
          creator={this.state.creator}
          commentCount={this.state.commentCount}
        />
        <PostDetailInfoBar
          address={this.props.postAddress}
          // views={post.views}
          // upvotePercentage={post.upvotePercentage}
          author={this.state.creator}
        />
        <CommentFormContainer
          postAddress={this.props.postAddress}
          forumAddress={this.state.forumAddress}
        />
        {/* <PostDetailCommentSection comments={post.comments} /> */}
        <PostDetailCommentSection comments={this.state.comments} />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3
  };
}

export default connect(mapStateToProps)(PostDetail);
