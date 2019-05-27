import React, { Component } from 'react';
import TartarusContract from '../../../contracts/Tartarus.json';
import { updateUserSaved } from '../../../redux/actions/actions';
import styled from 'styled-components/macro';
import PostContent from './Content/index.js';
import PostVote from './Vote/Component.js';
import { withRouter } from 'react-router';

const services = require('../../../services');

const Wrapper = styled.div`
  display: flex;
  height: auto;
  background-color: ${props => props.theme.foreground};
`;

class Post extends Component {
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
        .then(post => {
          if (
            post[0] ===
            '0x0000000000000000000000000000000000000000000000000000000000000000'
          ) {
            this.setState({
              exists: false,
              loading: false
            });
          } else {
            const bs58 = require('bs58');
            const postHex = '1220' + post[0].slice(2);
            const postBytes32 = Buffer.from(postHex, 'hex');
            const postIpfsHash = bs58.encode(postBytes32);

            services.ipfs.getJson(postIpfsHash).then(postData => {
              if (this.props.username !== null) {
                this.checkSaved();
              }
              console.log('loaded');
              this.setState({
                title: postData.title,
                type: postData.type,
                post: postData.post,
                votes: post[2].c[0],
                comments: post[3].c[0],
                loading: false,
                canDelete: this.checkCanDelete(post)
              });
            });
          }
        });
    });
  }

  checkCanDelete = props => {
    // console.log(this.props.userPermissions.admin)
    console.log(this.props.userPermissions.moderator);
    return (
      this.props.username === this.props.web3.utils.toUtf8(props[1]) ||
      this.props.userPermissions.admin[0] ||
      this.props.userPermissions.admin[6] ||
      this.props.userPermissions.moderator[0] ||
      this.props.userPermissions.moderator[5]
    );
  };

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

  handleReport = () => {
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      this.props.history.push(
        `/f/${this.props.web3.utils.toAscii(this.props.post.forum)}/p/${
          this.props.post.postId
        }/report`
      );
    }
  };

  render() {
    if (!this.state.exists) {
      return null;
    } else {
      return (
        <Wrapper>
          <PostVote
            votes={this.state.votes}
            loading={this.state.voteLoading}
            handleUpvote={this.handleUpvote}
            handleDownvote={this.handleDownvote}
          />
          <PostContent
            loading={this.state.loading}
            showFullPost={this.props.showFullPost}
            type={this.state.type}
            postId={this.props.post.postId}
            title={this.state.title}
            post={this.state.post}
            time={this.props.post.time.c[0] * 1000}
            creator={this.props.web3.utils.toAscii(this.props.post.creator)}
            forumName={this.props.web3.utils.toAscii(this.props.post.forum)}
            commentCount={this.state.comments}
            canDelete={this.state.canDelete}
            saved={this.state.saved}
            handleSave={this.handleSave}
            handleUnsave={this.handleUnsave}
            handleDelete={this.handleDelete}
            handleReport={this.handleReport}
          />
        </Wrapper>
      );
    }
  }
}

export default withRouter(Post);
