import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostContract from '../../contracts/Post.json';
import ForumContract from '../../contracts/Forum.json';
import Post from './Post';
import ipfs from '../../services/ipfs/ipfs';
import LoadingIndicatorBox from '../shared/LoadingIndicator/Box.js';
import Empty from '../shared/Empty.js';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner.js';

class PostContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      post: null,
      creator: null,
      forum: null,
      forumName: null,
      time: null,
      loading: true,
      votes: null,
      comments: null,
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
    post.at(this.props.address).then(postInstance => {
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
                        forum: owner,
                        forumName: forumName,
                        time: result[2].c[0] * 1000,
                        votes: result[3].c[0],
                        comments: comments.length,
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

  upvote = () => {
    const contract = require('truffle-contract');
    const post = contract(PostContract);
    post.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      post.at(this.props.address).then(instance => {
        instance.upvote({ from: accounts[0], gasPrice: 20000000000 });
      });
    });
  };

  downvote = () => {
    const contract = require('truffle-contract');
    const post = contract(PostContract);
    post.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      post.at(this.props.address).then(instance => {
        instance.downvote({ from: accounts[0], gasPrice: 20000000000 });
      });
    });
  };

  render() {
    if (this.state.loading) {
      return <LoadingIndicatorSpinner />;
    } else {
      return (
        <Post
          address={this.props.address}
          title={this.state.title}
          post={this.state.post}
          creator={this.state.creator}
          forum={this.state.forum}
          forumName={this.state.forumName}
          time={this.state.time}
          votes={this.state.votes}
          upvote={this.upvote}
          comments={this.state.comments}
          downvote={this.downvote}
        />
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    accounts: state.accounts,
    tartarusAddress: state.tartarus.tartarusAddress
  };
}

export default connect(mapStateToProps)(PostContainer);
