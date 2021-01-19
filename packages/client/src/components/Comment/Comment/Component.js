import React, { Component } from 'react';
import styled from 'styled-components/macro';
import CommentContent from './Content';
import TartarusContract from '../../../contracts/Tartarus.json';
import CommentDetail from './Detail/Component';
import {
  updateUserSaved,
  updateUserWatched
} from '../../../redux/actions/actions';
import CommentActions from './CommentActions';
import CommentReplyFormContainer from '../../CreateCommentReplyForm/Container';
import {
  confirmToast,
  warningToast,
  errorToast
} from '../../Notifications/Toasts/Toast';
import { withRouter } from 'react-router';

const Wrapper = styled.div`
  border-radius: 2px;
  background-color: ${props => props.theme.foreground};
  margin-left: ${props =>
    props.isChild ? `${props.commentDepth * 6}px` : '0px'};

  border: 0.5px solid ${props =>
    props.highlight ? props.theme.accent : props.theme.foreground};

    border-left: 0.5px solid ${props =>
      props.isChild || props.highlight
        ? props.theme.accent
        : props.theme.foreground};
  
  @media (max-width: 768px) {
    border-left: none;
    border-right: none;
    border-radius: 0;
  }

  // &:hover {
  //   border: 0.5px solid ${props => props.theme.accent};
  // }
`;

const services = require('../../../services');

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: null,
      comments: 0,
      time: null,
      saved: false,
      watched: false,
      loading: true,
      exists: true,
      deleted: false,
      forumName: null
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    if (this.props.forumName === undefined) {
      const contract = require('truffle-contract');
      const tartarus = contract(TartarusContract);
      tartarus.setProvider(this.props.web3.currentProvider);
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance
          .PostCreated(
            {
              postId: this.props.comment.args.postId
            },
            {
              fromBlock: 0,
              toBlock: 'latest'
            }
          )
          .get((error, post) => {
            // console.log(post)
            // console.log(this.props.comment.args.postId)
            this.setState({
              forumName: this.props.web3.utils.toAscii(post[0].args.forum)
            });
            this.instantiateContract(
              this.props.web3.utils.toAscii(post[0].args.forum)
            );
          });
      });
    } else {
      this.setState({
        forumName: this.props.forumName
      });
      this.instantiateContract(this.props.forumName);
    }
  };

  instantiateContract = props => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    tartarus.at(this.props.tartarusAddress).then(instance => {
      instance
        .getComment(props, this.props.comment.args.commentId)
        .then(comment => {
          if (
            comment[1] ===
            '0x0000000000000000000000000000000000000000000000000000000000000000'
          ) {
            this.setState({
              loading: false,
              exists: false
            });
          } else {
            instance
              .CommentCreated(
                {
                  targetId: this.props.comment.args.commentId
                },
                {
                  fromBlock: 0,
                  toBlock: 'latest'
                }
              )
              .get(async (error, comments) => {
                if (
                  comment[0] !==
                  '0x0000000000000000000000000000000000000000000000000000000000000000'
                ) {
                  const bs58 = require('bs58');
                  const commentHex = '1220' + comment[0].slice(2);
                  const commentBytes32 = Buffer.from(commentHex, 'hex');
                  const commentIpfsHash = bs58.encode(commentBytes32);
                  let commentData = await services.ipfs.getJson(
                    commentIpfsHash
                  );
                  if (this.props.username !== null) {
                    this.checkSaved();
                    this.checkWatched();
                  }
                  this.setState({
                    isModerator: await instance.isModerator.call(
                      this.props.comment.args.user,
                      props
                    ),
                    isAdmin: await this.checkIsAdmin(
                      this.props.comment.args.user
                    ),
                    comment: commentData.comment,
                    comments: comments.length,
                    loading: false,
                    time: this.props.comment.args.time.c[0] * 1000,
                    canDelete: this.checkCanDelete(comment[1]),
                    canBan: this.checkCanBan(comment[1])
                  });
                } else {
                  if (this.props.username !== null) {
                    this.checkSaved();
                    this.checkWatched();
                  }
                  this.setState({
                    isModerator: await instance.isModerator.call(
                      this.props.comment.args.user,
                      props
                    ),
                    isAdmin: await this.checkIsAdmin(
                      this.props.comment.args.user
                    ),
                    comment: 'removed',
                    deleted: true,
                    comments: comments.length,
                    loading: false,
                    time: this.props.comment.args.time.c[0] * 1000,
                    canDelete: this.checkCanDelete(comment[1]),
                    canBan: this.checkCanBan(comment[1])
                  });
                }
              });
          }
        });
    });
  };

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

  checkCanDelete = props => {
    return (
      this.props.username === this.props.web3.utils.toUtf8(props) ||
      this.props.userPermissions.admin[0] ||
      this.props.userPermissions.admin[6] ||
      this.props.userPermissions.moderator[0] ||
      this.props.userPermissions.moderator[5]
    );
  };

  checkSaved = () => {
    const index = this.props.userSettings[
      this.props.username
    ].saved.comments.findIndex(
      comment => comment.commentId === this.props.comment.args.commentId
    );
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

  checkWatched = () => {
    const index = this.props.userSettings[
      this.props.username
    ].watched.comments.findIndex(
      comment => comment.commentId === this.props.comment.args.commentId
    );
    if (index === -1) {
      this.setState({
        watched: false
      });
    } else {
      this.setState({
        watched: true
      });
    }
  };

  handleWatch = props => {
    console.log('watch');
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      let newWatchedCommentsArray = this.props.userSettings[this.props.username]
        .watched;
      newWatchedCommentsArray.comments.push({
        commentId: props,
        args: this.props.comment.args,
        event: 'CommentCreated'
      });
      let payload = {
        username: this.props.username,
        watched: newWatchedCommentsArray
      };
      this.props.dispatch(updateUserWatched(payload));
      this.checkWatched();
    }
  };

  handleUnwatch = props => {
    console.log('unwatch');
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      let newWatched = this.props.userSettings[this.props.username].watched;
      let newWatchedCommentsArray = newWatched.comments.slice();
      for (var i = 0; i < newWatchedCommentsArray.length; i++) {
        if (newWatchedCommentsArray[i].commentId === props) {
          newWatchedCommentsArray.splice(i, 1);
        }
      }
      newWatched.comments = newWatchedCommentsArray;
      let payload = {
        username: this.props.username,
        watched: newWatched
      };
      this.props.dispatch(updateUserWatched(payload));
      this.checkWatched();
    }
  };

  handleSave = props => {
    console.log('save');
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      let newSavedCommentsArray = this.props.userSettings[this.props.username]
        .saved;
      newSavedCommentsArray.comments.push({
        commentId: props,
        args: this.props.comment.args,
        event: 'CommentCreated'
      });
      let payload = {
        username: this.props.username,
        saved: newSavedCommentsArray
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
      let newSavedCommentsArray = newSaved.comments.slice();
      for (var i = 0; i < newSavedCommentsArray.length; i++) {
        if (newSavedCommentsArray[i].commentId === props) {
          newSavedCommentsArray.splice(i, 1);
        }
      }
      newSaved.comments = newSavedCommentsArray;
      let payload = {
        username: this.props.username,
        saved: newSaved
      };
      this.props.dispatch(updateUserSaved(payload));
      this.checkSaved();
    }
  };

  handleDelete = () => {
    console.log('delete');
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      warningToast();
      const contract = require('truffle-contract');
      const tartarus = contract(TartarusContract);
      tartarus.setProvider(this.props.web3.currentProvider);
      this.props.web3.eth.getAccounts((error, accounts) => {
        tartarus.at(this.props.tartarusAddress).then(instance => {
          instance.removeComment
            .sendTransaction(
              this.props.web3.utils.fromAscii(this.props.username),
              this.props.web3.utils.fromAscii(this.state.forumName),
              this.props.comment.args.postId,
              this.props.comment.args.commentId,
              { from: accounts[0], gasPrice: 20000000000 }
            )
            .then(result => {
              confirmToast();
            })
            .catch(error => {
              console.log('error');
              // this.setState({
              //   loading: false
              // });
            });
        });
      });
    }
  };

  checkIsBanned = () => {
    // should check if user banned, update contract for this add getter
  };

  checkCanBan = props => {
    return (
      this.props.userPermissions.admin[0] ||
      this.props.userPermissions.admin[1] ||
      this.props.userPermissions.moderator[0] ||
      this.props.userPermissions.moderator[1]
    );
  };

  handleBan = () => {
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      console.log('ban');
      warningToast();
      const contract = require('truffle-contract');
      const tartarus = contract(TartarusContract);
      tartarus.setProvider(this.props.web3.currentProvider);
      this.props.web3.eth.getAccounts((error, accounts) => {
        tartarus.at(this.props.tartarusAddress).then(instance => {
          console.log(this.props);
          instance.moderatorBan
            .sendTransaction(
              this.props.web3.utils.fromAscii(this.props.username),
              this.props.comment.args.user,
              this.props.web3.utils.fromAscii(this.state.forumName),
              { from: accounts[0], gasPrice: 20000000000 }
            )
            .then(result => {
              // this.setState({
              //   loading: false
              // });
              confirmToast();
            })
            .catch(error => {
              console.log('error');
              // this.setState({
              //   loading: false
              // });
              errorToast();
            });
        });
      });
    }
  };

  render() {
    if (this.state.exists) {
      return (
        <Wrapper
          highlight={
            this.props.focused ||
            this.props.parentHover === this.props.comment.args.commentId
          }
          isChild={this.props.isChild}
          commentDepth={this.props.commentDepth}
          // onClick={() => this.props.handleFocus(this.props.comment)}
        >
          <CommentDetail
            creator={this.props.web3.utils.toAscii(
              this.props.comment.args.user
            )}
            loading={this.state.loading}
            dark={this.props.dark}
            creatorHex={this.props.comment.args.user}
            isModerator={this.state.isModerator}
            isAdmin={this.state.isAdmin}
            handleParentHover={this.props.handleParentHover}
            time={this.state.time}
            saved={this.state.saved}
            targetId={this.props.comment.args.targetId}
            forumName={this.state.forumName}
            commentId={this.props.comment.args.commentId}
            postId={this.props.comment.args.postId}
            index={this.props.index}
            handleScroll={this.props.handleScroll}
            disabled={this.props.disabled}
            direct={this.props.direct}
          />
          <CommentContent
            loading={this.state.loading}
            comment={this.state.comment}
            dark={this.props.dark}
          />
          <CommentActions
            comment={this.props.comment}
            loading={this.state.loading}
            dark={this.props.dark}
            forumName={this.state.forumName}
            postId={this.props.comment.args.postId}
            comments={this.state.comments}
            focused={this.props.focused}
            handleReply={this.props.handleReply}
            handleSave={this.handleSave}
            handleUnsave={this.handleUnsave}
            saved={this.state.saved}
            canDelete={this.state.canDelete}
            deleted={this.state.deleted}
            handleDelete={this.handleDelete}
            handleFocus={this.props.handleFocus}
            disabled={this.props.disabled}
            direct={this.props.direct}
            watched={this.state.watched}
            handleWatch={this.handleWatch}
            handleUnwatch={this.handleUnwatch}
            canBan={this.state.canBan}
            handleBan={this.handleBan}
          />
          {this.props.currentComment === this.props.comment.args.commentId ? (
            <CommentReplyFormContainer
              handleReply={this.props.handleReply}
              postId={this.props.comment.args.postId}
              commentId={this.props.comment.args.commentId}
              forumName={this.state.forumName}
              targetId={this.props.comment.args.commentId}
            />
          ) : null}
        </Wrapper>
      );
    } else {
      return null;
    }
  }
}

export default withRouter(Comment);
