import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostContract from '../../contracts/Post.json';
import ForumContract from '../../contracts/Forum.json';
import UserContract from '../../contracts/User.json';
import TartarusContract from '../../contracts/Tartarus.json';
import Post from './Post';
import ipfs from '../../services/ipfs/ipfs';
import LoadingIndicatorBox from '../shared/LoadingIndicator/Box.js';
import Empty from '../shared/Empty.js';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner.js';
import Loading from '../shared/LoadingIndicator/Loading.js';

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
      preview: false
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
    user.setProvider(this.props.web3.currentProvider);
    tartarus.setProvider(this.props.web3.currentProvider);
    forum.setProvider(this.props.web3.currentProvider);
    post.at(this.props.address).then(postInstance => {
      postInstance.postInfo.call().then(result => {
        user.at(result[4]).then(userInstance => {
          userInstance.username.call().then(userName => {
            postInstance.owner.call().then(owner => {
              forum.at(owner).then(forumInstance => {
                forumInstance.name.call().then(forumName => {
                  tartarus
                    .at(this.props.tartarusAddress)
                    .then(tartarusInstance => {
                      tartarusInstance
                        .CommentCreated(
                          { postAddress: this.props.address },
                          { fromBlock: 0, toBlock: 'latest' }
                        )
                        .get((error, comments) => {
                          const bs58 = require('bs58');
                          const hashHex = '1220' + result[3].slice(2);
                          const hashBytes = Buffer.from(hashHex, 'hex');
                          const ipfsHash = bs58.encode(hashBytes);
                          ipfs.catJSON(ipfsHash, (err, ipfsData) => {
                            if (ipfsData) {
                              this.setState({
                                title: ipfsData.title,
                                creator: this.props.web3.utils.hexToAscii(
                                  userName
                                ),
                                post: ipfsData.post,
                                forum: owner,
                                forumName: this.props.web3.utils.hexToAscii(
                                  forumName
                                ),
                                time: result[2].c[0] * 1000,
                                votes: result[0].c[0] + result[1].c[0],
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
      return <Loading />;
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
          preview={this.state.preview}
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
