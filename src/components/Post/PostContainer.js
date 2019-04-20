import React, { Component } from 'react';
import { connect } from 'react-redux';
import TartarusContract from '../../contracts/Tartarus.json';
import Post from './Post';
import Empty from '../shared/Empty.js';
import { updateUserSaved } from '../../redux/actions/actions';
import { withRouter } from 'react-router-dom';

const services = require('../../services');

class PostContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      type: null,
      post: null,
      creator: null,
      time: null,
      loading: true,
      voteLoading: false,
      votes: null,
      comments: null,
      exists: true,
      saved: false,
      canReport: false,
      canDelete: false,
      toggleTip: false,
      toggleReport: false
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
    tartarus.at(this.props.tartarusAddress).then(instance => {
      instance
        .getPost(this.props.post.forum, this.props.post.postId)
        .then(async post => {
          console.log(post);
          if (
            post[0] ===
            '0x0000000000000000000000000000000000000000000000000000000000000000'
          ) {
            this.setState({
              exists: false
            });
          } else {
            const bs58 = require('bs58');
            const postHex = '1220' + post[0].slice(2);
            const postBytes32 = Buffer.from(postHex, 'hex');
            const postIpfsHash = bs58.encode(postBytes32);

            const postData = await services.ipfs.getJson(postIpfsHash);
            if (this.props.username !== null) {
              this.checkSaved();
            }
            this.setState({
              title: postData.title,
              type: postData.type,
              post: postData.post,
              votes: post[2].c[0],
              comments: post[3].c[0],
              loading: false,
              canDelete:
                this.props.username === this.props.web3.utils.toUtf8(post[1])
            });
          }
        });
    });
  }

  checkSaved = () => {
    const index = this.props.userSettings[
      this.props.username
    ].saved.posts.findIndex(post => post.postId === this.props.post.postId);
    if (index === -1) {
      this.setState({
        saved: false
      });
    } else {
      this.setState({
        saved: true
      });
    }
  };

  handleSave = props => {
    console.log('save');
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      let newSavedPostsArray = this.props.userSettings[this.props.username]
        .saved;
      newSavedPostsArray.posts.push({
        postId: props
      });
      let payload = {
        username: this.props.username,
        saved: newSavedPostsArray
      };
      this.props.dispatch(updateUserSaved(payload));
      this.checkSaved();
    }
  };

  handleUnsave = props => {
    console.log('unsave');
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      let newSaved = this.props.userSettings[this.props.username].saved;
      let newSavedPostsArray = newSaved.posts.slice();
      for (var i = 0; i < newSavedPostsArray.length; i++) {
        if (newSavedPostsArray[i].postId === props) {
          newSavedPostsArray.splice(i, 1);
        }
      }
      newSaved.posts = newSavedPostsArray;
      let payload = {
        username: this.props.username,
        saved: newSaved
      };
      this.props.dispatch(updateUserSaved(payload));
      this.checkSaved();
    }
  };

  handleDelete = () => {
    console.log('unsave');
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      const contract = require('truffle-contract');
      const tartarus = contract(TartarusContract);
      tartarus.setProvider(this.props.web3.currentProvider);
      this.props.web3.eth.getAccounts((error, accounts) => {
        tartarus.at(this.props.tartarusAddress).then(instance => {
          instance.deletePost
            .sendTransaction(
              this.props.web3.utils.fromAscii(this.props.username),
              this.props.post.forum,
              this.props.post.postId,
              { from: accounts[0], gasPrice: 20000000000 }
            )
            .then(result => {
              this.setState({
                loading: false
              });
              this.props.reset('createForum');
              this.props.history.goBack();
            })
            .catch(error => {
              console.log('error');
              this.setState({
                loading: false
              });
            });
        });
      });
    }
  };

  handleUpvote = () => {
    console.log('unsave');
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      this.setState({
        voteLoading: true
      });
      const contract = require('truffle-contract');
      const tartarus = contract(TartarusContract);
      tartarus.setProvider(this.props.web3.currentProvider);
      this.props.web3.eth.getAccounts((error, accounts) => {
        tartarus.at(this.props.tartarusAddress).then(instance => {
          instance.voteCost.call().then(voteCost => {
            instance.upvote
              .sendTransaction(
                this.props.post.forum,
                this.props.web3.utils.fromAscii(this.props.username),
                this.props.post.postId,
                { from: accounts[0], gasPrice: 20000000000, value: voteCost }
              )
              .then(result => {
                this.setState({
                  voteLoading: false
                });
                this.props.reset('createForum');
                this.props.history.goBack();
              })
              .catch(error => {
                console.log('error');
                this.setState({
                  voteLoading: false
                });
              });
          });
        });
      });
    }
  };

  handleDownvote = () => {
    console.log('unsave');
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      this.setState({
        voteLoading: true
      });
      const contract = require('truffle-contract');
      const tartarus = contract(TartarusContract);
      tartarus.setProvider(this.props.web3.currentProvider);
      this.props.web3.eth.getAccounts((error, accounts) => {
        tartarus.at(this.props.tartarusAddress).then(instance => {
          instance.voteCost.call().then(voteCost => {
            instance.downvote
              .sendTransaction(
                this.props.post.forum,
                this.props.web3.utils.fromAscii(this.props.username),
                this.props.post.postId,
                { from: accounts[0], gasPrice: 20000000000, value: voteCost }
              )
              .then(result => {
                this.setState({
                  voteLoading: false
                });
                this.props.reset('createForum');
                this.props.history.goBack();
              })
              .catch(error => {
                console.log('error');
                this.setState({
                  loading: false
                });
              });
          });
        });
      });
    }
  };

  render() {
    if (!this.state.exists) {
      // return <Empty />;
      return null;
    } else {
      return (
        <Post
          loading={this.state.loading}
          title={this.state.title}
          post={this.state.post}
          type={this.state.type}
          postId={this.props.post.postId}
          creator={this.props.web3.utils.toAscii(this.props.post.creator)}
          forumName={this.props.web3.utils.toAscii(this.props.post.forum)}
          time={this.props.post.time.c[0] * 1000}
          votes={this.state.votes}
          voteLoading={this.state.voteLoading}
          comments={this.state.comments}
          canDelete={this.state.canDelete}
          saved={this.state.saved}
          handleSave={this.handleSave}
          handleUnsave={this.handleUnsave}
          handleUpvote={this.handleUpvote}
          handleDownvote={this.handleDownvote}
          handleDelete={this.handleDelete}
          showFullPost={false}
        />
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    username: state.user.username,
    userSettings: state.user.userSettings,
    tartarusAddress: state.tartarus.tartarusAddress
  };
}

export default withRouter(connect(mapStateToProps)(PostContainer));
