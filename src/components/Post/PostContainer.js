import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostContract from '../../contracts/Post.json';
import TartarusContract from '../../contracts/Tartarus.json';
import Post from './Post';
import ipfs from '../../services/ipfs/ipfs';
import Empty from '../shared/Empty.js';

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
      exists: true,
      type: null,
      preview: false,
      canDelete: false,
      canReport: false
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract() {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    const username = this.props.web3.utils.toAscii(this.props.post.creator);
    const forumName = this.props.web3.utils.toAscii(this.props.post.forum);
    tartarus.setProvider(this.props.web3.currentProvider);
    tartarus.at(this.props.tartarusAddress).then(instance => {
      instance.forums.call(this.props.post.forum).then(forum => {
      instance.posts.call(this.props.post.postId).then(post => {
        console.log(post);
        const bs58 = require('bs58');
        const titleHex = '1220' + post[0].slice(2);
        const titleBytes32 = Buffer.from(titleHex, 'hex');
        const titleIpfsHash = bs58.encode(titleBytes32);

        const postHex = '1220' + post[1].slice(2);
        const postBytes32 = Buffer.from(postHex, 'hex');
        const postIpfsHash = bs58.encode(postBytes32);
        console.log(titleIpfsHash);
        console.log(postIpfsHash);
        // ipfs.stat(titleIpfsHash, (err, result) => {
        //   console.log(err, result);
        // });
        ipfs.catJSON(titleIpfsHash, (err, titleData) => {
          ipfs.catJSON(postIpfsHash, (err, postData) => {
            // if (err) {
            //   console.log(err);
            //   throw err;
            // }
            console.log(titleData);
            console.log(postData);
            this.setState({
              title: titleData.title,
              creator: username,
              type: postData.type,
              post: postData.post,
              forumName: forumName,
              time: post[4].c[0] * 1000,
              votes: post[3].c[0],
              comments: post[6],
              loading: false,
              canDelete:
                this.props.web3.utils.fromAscii(this.props.username) === post[2]
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
    if (!this.state.exists) {
      return <Empty />;
    } else {
      console.log(this.state);
      return (
        <Post
          loading={this.state.loading}
          address={this.props.address}
          title={this.state.title}
          post={this.state.post}
          type={this.state.type}
          creator={this.state.creator}
          forum={this.state.forum}
          forumName={this.state.forumName}
          time={this.state.time}
          votes={this.state.votes}
          upvote={this.upvote}
          comments={this.state.comments}
          downvote={this.downvote}
          preview={this.state.preview}
          showFullPost={this.props.showFullPost}
          canDelete={this.state.canDelete}
        />
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    username: state.user.username,
    tartarusAddress: state.tartarus.tartarusAddress
  };
}

export default connect(mapStateToProps)(PostContainer);
