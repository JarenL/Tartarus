import React, { Component } from 'react';
import TartarusContract from '../../../contracts/Tartarus.json';
import { updateUserSaved } from '../../../redux/actions/actions';
import styled from 'styled-components/macro';
import PostContent from './Content/index.js';
import PostVote from './Vote/Component.js';
import { withRouter } from 'react-router';
import Empty from '../../shared/Empty.js';

const services = require('../../../services');

const Wrapper = styled.div`
  display: flex;
  height: auto;
  background-color: ${props => props.theme.foreground};
  &:hover {
    border: 0.5px solid ${props => props.theme.accent};
  }
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
      canPin: false,
      canLock: false,
      toggleTip: false,
      toggleReport: false,
      upvoted: false,
      downvoted: false,
      isModerator: false,
      isAdmin: false
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
              exists: false,
              loading: false
            });
          } else {
            const bs58 = require('bs58');
            const postHex = '1220' + post[0].slice(2);
            const postBytes32 = Buffer.from(postHex, 'hex');
            const postIpfsHash = bs58.encode(postBytes32);

            await this.checkUserVoted();

            let postData = await services.ipfs.getJson(postIpfsHash);
            if (this.props.username !== null) {
              this.checkSaved();
            }
            if (postData !== null) {
              console.log(this.props.post.forum);
              console.log(this.props.web3.utils.toUtf8(this.props.post.forum));
              let adminPinnedPosts = await instance.getForumPinnedPosts(
                this.props.web3.utils.fromAscii('announcements')
              );
              let pinnedPosts = await instance.getForumPinnedPosts(
                this.props.post.forum
              );

              this.setState({
                isModerator: await this.checkIsModerator(post[1]),
                isAdmin: await this.checkIsAdmin(post[1]),
                loading: false,
                title: postData.title,
                type: postData.type,
                post: postData.post,
                votes: post[2].c[0] - post[3].c[0],
                comments: post[4].c[0],
                canDelete: this.checkCanDelete(post),
                canPin: this.checkCanPin(),
                canLock: this.checkCanLock(),
                isLocked: post[5].c[0],
                forumPinned: pinnedPosts.indexOf(this.props.post.postId) !== -1,
                adminPinned:
                  adminPinnedPosts.indexOf(this.props.post.postId) !== -1
              });
            } else {
              this.setState({
                exists: false,
                loading: false
              });
            }
          }
        });
    });
  }

  checkIsModerator = async props => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    return await instance.isModerator.call(props, this.props.post.forum);
  };

  checkIsAdmin = async props => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    return await instance.isAdmin.call(props);
  };

  checkUserVoted = () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.getUserVoted
          .call(
            this.props.post.forum,
            this.props.web3.utils.fromAscii(this.props.username),
            this.props.post.postId
          )
          .then(result => {
            this.setState({
              upvoted: result[0],
              downvoted: result[1]
            });
          })
          .catch(error => {
            console.log('error');
          });
      });
    });
  };

  checkCanDelete = props => {
    // console.log(this.props.userPermissions.admin)
    return (
      this.props.username === this.props.web3.utils.toUtf8(props[1]) ||
      this.props.userPermissions.admin[0] ||
      this.props.userPermissions.admin[6] ||
      this.props.userPermissions.moderator[0] ||
      this.props.userPermissions.moderator[5]
    );
  };

  checkCanPin = () => {
    // console.log(this.props.userPermissions.admin)
    return (
      this.props.userPermissions.admin[0] ||
      this.props.userPermissions.admin[6] ||
      this.props.userPermissions.moderator[0] ||
      this.props.userPermissions.moderator[5]
    );
  };

  checkCanLock = () => {
    return (
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
        postId: props,
        args: this.props.post,
        event: 'PostCreated'
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
          instance.deletePost.sendTransaction(
            this.props.web3.utils.fromAscii(this.props.username),
            this.props.post.forum,
            this.props.post.postId,
            { from: accounts[0], gasPrice: 20000000000 }
          );
          // .then(result => {
          //   this.setState({
          //     loading: false
          //   });
          //   this.props.reset('createForum');
          //   this.props.history.goBack();
          // })
          // .catch(error => {
          //   console.log('error');
          //   this.setState({
          //     loading: false
          //   });
          // });
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

  handlePin = async () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let accounts = await this.props.web3.eth.getAccounts();
    let instance = await tartarus.at(this.props.tartarusAddress);
    let pinnedPosts = await instance.getForumPinnedPosts(this.props.post.forum);
    for (let i = 0; i < pinnedPosts.length; i++) {
      if (
        pinnedPosts[i] ===
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      ) {
        instance.pinPost.sendTransaction(
          this.props.web3.utils.fromAscii(this.props.username),
          this.props.post.forum,
          this.props.post.postId,
          i,
          { from: accounts[0], gasPrice: 20000000000 }
        );
        break;
      }
    }
    console.log(pinnedPosts);
  };

  handleUnpin = async () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let accounts = await this.props.web3.eth.getAccounts();
    let instance = await tartarus.at(this.props.tartarusAddress);
    let pinnedPosts = await instance.getForumPinnedPosts(this.props.post.forum);
    for (let i = 0; i < pinnedPosts.length; i++) {
      console.log(this.props.post.postId);
      console.log(pinnedPosts[i]);
      if (pinnedPosts[i] === this.props.post.postId) {
        instance.unpinPost
          .sendTransaction(
            this.props.web3.utils.fromAscii(this.props.username),
            this.props.post.forum,
            i,
            { from: accounts[0], gasPrice: 20000000000 }
          )
          .catch(error => {
            console.log('error');
          });
        break;
      }
    }
    console.log(pinnedPosts);
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

  handleLock = async () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let accounts = await this.props.web3.eth.getAccounts();
    let instance = await tartarus.at(this.props.tartarusAddress);
    instance.changePostLock
      .sendTransaction(
        this.props.web3.utils.fromAscii(this.props.username),
        this.props.post.forum,
        this.props.post.postId,
        this.props.userPermissions.admin[0] ||
          this.props.userPermissions.admin[6]
          ? 2
          : 1,
        { from: accounts[0], gasPrice: 20000000000 }
      )
      .catch(error => {
        console.log('error');
      });
  };

  handleUnlock = async () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let accounts = await this.props.web3.eth.getAccounts();
    let instance = await tartarus.at(this.props.tartarusAddress);
    instance.changePostLock
      .sendTransaction(
        this.props.web3.utils.fromAscii(this.props.username),
        this.props.post.forum,
        this.props.post.postId,
        0,
        { from: accounts[0], gasPrice: 20000000000 }
      )
      .catch(error => {
        console.log('error');
      });
  };

  handleClick = () => {
    this.props.history.push(
      `/f/${this.props.web3.utils.toAscii(this.props.post.forum)}/p/${
        this.props.post.postId
      }`
    );
  };

  render() {
    if (!this.state.exists) {
      if (this.props.showDeleted) {
        return <Empty />;
      } else {
        return null;
      }
    } else {
      return (
        <Wrapper>
          <PostVote
            votes={this.state.votes}
            upvoted={this.state.upvoted}
            downvoted={this.state.downvoted}
            loading={this.state.voteLoading}
            handleUpvote={this.handleUpvote}
            handleDownvote={this.handleDownvote}
          />
          <PostContent
            isModerator={this.state.isModerator}
            isAdmin={this.state.isAdmin}
            loading={this.state.loading}
            showFullPost={this.props.showFullPost}
            type={this.state.type}
            postId={this.props.post.postId}
            title={this.state.title}
            post={this.state.post}
            time={this.props.post.time.c[0] * 1000}
            creatorHex={this.props.post.creator}
            creator={this.props.web3.utils.toAscii(this.props.post.creator)}
            forumName={this.props.web3.utils.toAscii(this.props.post.forum)}
            commentCount={this.state.comments}
            canDelete={this.state.canDelete}
            canPin={this.state.canPin}
            isLocked={this.state.isLocked}
            canLock={this.state.canLock}
            handlePin={this.handlePin}
            handleUnpin={this.handleUnpin}
            handleLock={this.handleLock}
            handleUnlock={this.handleUnlock}
            saved={this.state.saved}
            handleSave={this.handleSave}
            handleUnsave={this.handleUnsave}
            handleDelete={this.handleDelete}
            handleReport={this.handleReport}
            forumPinned={this.state.forumPinned}
            adminPinned={this.state.adminPinned}
          />
        </Wrapper>
      );
    }
  }
}

export default withRouter(Post);
