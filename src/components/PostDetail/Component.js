import React, { Component } from 'react';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';
import Empty from '../shared/Empty';
import PostDetailPost from './Post';
import CommentFormContainer from '../CreateCommentForm/Container';
import PostDetailCommentSection from './CommentSection';
import ipfs from '../../services/ipfs/ipfs';
import PostContract from '../../contracts/Post.json';
import ForumContract from '../../contracts/Forum.json';
import TartarusContract from '../../contracts/Tartarus.json';
import UserContract from '../../contracts/User.json';
import PostDetailInfoBarContainer from './InfoBar/Container';

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
    const user = contract(UserContract);
    const tartarus = contract(TartarusContract);
    post.setProvider(this.props.web3.currentProvider);
    forum.setProvider(this.props.web3.currentProvider);
    user.setProvider(this.props.web3.currentProvider);
    tartarus.setProvider(this.props.web3.currentProvider);
    post.at(this.props.postAddress).then(postInstance => {
      postInstance.postInfo.call().then(result => {
        user.at(result[4]).then(userInstance => {
          userInstance.username.call().then(username => {
            postInstance.owner.call().then(owner => {
              forum.at(owner).then(forumInstance => {
                forumInstance.name.call().then(forumName => {
                  tartarus
                    .at(this.props.tartarusAddress)
                    .then(tartarusInstance => {
                      tartarusInstance
                        .CommentCreated(
                          { postAddress: this.props.postAddress },
                          { fromBlock: 0, toBlock: 'latest' }
                        )
                        .get((error, comments) => {
                          console.log(comments)
                          const bs58 = require('bs58');
                          const hashHex = '1220' + result[3].slice(2);
                          const hashBytes = Buffer.from(hashHex, 'hex');
                          const ipfsHash = bs58.encode(hashBytes);
                          ipfs.catJSON(ipfsHash, (err, ipfsData) => {
                            if (ipfsData) {
                              this.setState({
                                title: ipfsData.title,
                                creator: this.props.web3.utils.hexToAscii(
                                  username
                                ),
                                post: ipfsData.post,
                                forumAddress: owner,
                                forumName: this.props.web3.utils.hexToAscii(
                                  forumName
                                ),
                                time: result[2].c[0] * 1000,
                                votes: result[0].c[0] - result[1].c[0],
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
        {/* <PostDetailInfoBarContainer
          address={this.props.postAddress}
          // views={post.views}
          // upvotePercentage={post.upvotePercentage}
          author={this.state.creator}
        /> */}
        <CommentFormContainer
          postAddress={this.props.postAddress}
          forumAddress={this.state.forumAddress}
        />
        <PostDetailCommentSection comments={this.state.comments} />
      </>
    );
  }
}

export default PostDetail;
