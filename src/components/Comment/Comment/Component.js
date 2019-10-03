import React, { Component } from 'react';
import styled from 'styled-components/macro';
import CommentContent from './Content';
import TartarusContract from '../../../contracts/Tartarus.json';
import CommentDetail from './Detail/Component';
import { updateUserSaved } from '../../../redux/actions/actions';
import CommentActions from './CommentActions';
import CommentReplyFormContainer from '../../CreateCommentReplyForm/Container';
import { confirmToast, warningToast } from '../../Notifications/Toasts/Toast';

const Wrapper = styled.div`
  border-radius: 2px;
  background-color: ${props => props.theme.foreground};
  border: 0.5px solid ${props => props.theme.foreground};

  @media (max-width: 768px) {
    border-left: none;
    border-right: none;
    border-radius: 0;
  }

  &:hover {
    border: 0.5px solid ${props => props.theme.accent};
  }
`;

const BorderWrapper = styled.div`
  border-radius: 2px;
  background-color: ${props => props.theme.foreground};
  border: 0.5px solid ${props => props.theme.accent};

  @media (max-width: 768px) {
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
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
      loading: true,
      exists: true
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
            this.instantiateContract(
              this.props.web3.utils.toAscii(post[0].args.forum)
            );
          });
      });
    } else {
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
                    canDelete: this.checkCanDelete(comment[1])
                  });
                } else {
                  if (this.props.username !== null) {
                    this.checkSaved();
                  }
                  this.setState({
                    isModerator: await instance.isModerator.call(
                      this.props.comment.args.user,
                      props
                    ),
                    isAdmin: await this.checkIsAdmin(
                      this.props.comment.args.user
                    ),
                    comment: <i>Deleted</i>,
                    comments: comments.length,
                    loading: false,
                    time: this.props.comment.args.time.c[0] * 1000,
                    canDelete: this.checkCanDelete(comment[1])
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

  handleReport = () => {};

  handleDelete = () => {
    console.log('unsave');
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
              this.props.web3.utils.fromAscii(this.props.forumName),
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

  render() {
    if (this.state.exists) {
      if (
        this.props.focused ||
        this.props.parentHover === this.props.comment.args.commentId
      ) {
        return (
          <BorderWrapper>
            <CommentDetail
              creator={this.props.web3.utils.toAscii(
                this.props.comment.args.user
              )}
              creatorHex={this.props.comment.args.user}
              isModerator={this.state.isModerator}
              isAdmin={this.state.isAdmin}
              time={this.state.time}
              saved={this.state.saved}
              targetId={this.props.comment.args.targetId}
              postId={this.props.comment.args.postId}
              handleParentHover={this.props.handleParentHover}
              disabled={this.props.disabled}
            />
            <CommentContent
              loading={this.state.loading}
              comment={this.state.comment}
            />
            <CommentActions
              comment={this.props.comment}
              forumName={this.props.forumName}
              postId={this.props.comment.args.postId}
              comments={this.state.comments}
              focused={this.props.focused}
              handleReply={this.props.handleReply}
              handleSave={this.handleSave}
              handleUnsave={this.handleUnsave}
              saved={this.state.saved}
              canDelete={this.state.canDelete}
              handleDelete={this.handleDelete}
              handleFocus={this.props.handleFocus}
              disabled={this.props.disabled}
            />
            {this.props.currentComment === this.props.comment.args.commentId ? (
              <CommentReplyFormContainer
                handleReply={this.props.handleReply}
                postId={this.props.comment.args.postId}
                commentId={this.props.comment.args.commentId}
                forumName={this.props.forumName}
                targetId={this.props.comment.args.commentId}
              />
            ) : null}
          </BorderWrapper>
        );
      } else {
        return (
          <Wrapper>
            <CommentDetail
              creator={this.props.web3.utils.toAscii(
                this.props.comment.args.user
              )}
              creatorHex={this.props.comment.args.user}
              isModerator={this.state.isModerator}
              isAdmin={this.state.isAdmin}
              handleParentHover={this.props.handleParentHover}
              time={this.state.time}
              saved={this.state.saved}
              targetId={this.props.comment.args.targetId}
              postId={this.props.comment.args.postId}
              index={this.props.index}
              handleScroll={this.props.handleScroll}
              disabled={this.props.disabled}
            />
            <CommentContent
              loading={this.state.loading}
              comment={this.state.comment}
            />
            <CommentActions
              comment={this.props.comment}
              forumName={this.props.forumName}
              postId={this.props.comment.args.postId}
              comments={this.state.comments}
              focused={this.props.focused}
              handleReply={this.props.handleReply}
              handleSave={this.handleSave}
              handleUnsave={this.handleUnsave}
              saved={this.state.saved}
              canDelete={this.state.canDelete}
              handleDelete={this.handleDelete}
              handleFocus={this.props.handleFocus}
              disabled={this.props.disabled}
            />
            {this.props.currentComment === this.props.comment.args.commentId ? (
              <CommentReplyFormContainer
                handleReply={this.props.handleReply}
                postId={this.props.comment.args.postId}
                commentId={this.props.comment.args.commentId}
                forumName={this.props.forumName}
                targetId={this.props.comment.args.commentId}
              />
            ) : null}
          </Wrapper>
        );
      }
    } else {
      return null;
    }
  }
}

export default Comment;
