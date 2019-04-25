import React, { Component } from 'react';
import styled from 'styled-components/macro';
import CommentContent from './Content';
import TartarusContract from '../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';
import CommentDetail from './Detail/Component';
import { updateUserSaved } from '../../redux/actions/actions';
import CommentActions from './Actions/CommentActions';
import CommentReplyFormContainer from '../CreateCommentReplyForm/Container';

const Wrapper = styled.div`
  border: 1px solid ${props => props.theme.border};
  border-radius: 2px;
  background-color: ${props => props.theme.foreground};

  @media (max-width: 768px) {
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
`;

const services = require('../../services');

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: null,
      username: null,
      post: null,
      forum: null,
      target: null,
      time: null,
      saved: false,
      commentReplies: null,
      loading: true,
      exists: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract() {
    console.log(this.props);
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    tartarus.at(this.props.tartarusAddress).then(instance => {
      instance
        .getComment(this.props.forumName, this.props.comment.commentId)
        .then(comment => {
          if (
            comment[0] ===
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
                  targetId: this.props.comment.commentId
                },
                {
                  fromBlock: 0,
                  toBlock: 'latest'
                }
              )
              .get(async (error, comments) => {
                console.log(comments);
                const bs58 = require('bs58');
                const commentHex = '1220' + comment[0].slice(2);
                const commentBytes32 = Buffer.from(commentHex, 'hex');
                const commentIpfsHash = bs58.encode(commentBytes32);

                const commentData = await services.ipfs.getJson(
                  commentIpfsHash
                );
                if (this.props.username !== null) {
                  this.checkSaved();
                }
                this.setState({
                  comment: commentData.comment,
                  comments: comments.length,
                  loading: false,
                  time: this.props.comment.time.c[0] * 1000,
                  canDelete:
                    this.props.username ===
                    this.props.web3.utils.toUtf8(comment[1])
                });
              });
          }
        });
    });
  }

  checkSaved = () => {
    const index = this.props.userSettings[
      this.props.username
    ].saved.comments.findIndex(
      comment => comment.commentId === this.props.comment.commentId
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
        commentId: props
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
    console.log('unsave');
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      const contract = require('truffle-contract');
      const tartarus = contract(TartarusContract);
      tartarus.setProvider(this.props.web3.currentProvider);
      this.props.web3.eth.getAccounts((error, accounts) => {
        tartarus.at(this.props.tartarusAddress).then(instance => {
          instance.deleteComment
            .sendTransaction(
              this.props.web3.utils.fromAscii(this.props.username),
              this.props.web3.utils.fromAscii(this.props.forumName),
              this.props.comment.postId,
              this.props.comment.commentId,
              { from: accounts[0], gasPrice: 20000000000 }
            )
            .then(result => {
              // this.setState({
              //   loading: false
              // });
              // this.props.reset('createForum');
              // this.props.history.goBack();
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
      return (
        <Wrapper>
          <CommentDetail
            creator={this.props.web3.utils.toAscii(this.props.comment.creator)}
            time={this.state.time}
            saved={this.state.saved}
          />
          <CommentContent
            loading={this.state.loading}
            comment={this.state.comment}
          />
          <CommentActions
            commentId={this.props.comment.commentId}
            comments={this.state.comments}
            handleReply={this.props.handleReply}
            handleSave={this.handleSave}
            handleUnsave={this.handleUnsave}
            saved={this.state.saved}
            canDelete={this.state.canDelete}
            handleDelete={this.handleDelete}
          />
          {this.props.currentComment === this.props.comment.commentId ? (
            <CommentReplyFormContainer
              handleReply={this.props.handleReply}
              postId={this.props.comment.postId}
              commentId={this.props.comment.commentId}
              forumName={this.props.forumName}
              targetId={this.props.commentId}
            />
          ) : null}
        </Wrapper>
      );
    } else {
      return null;
    }
  }
}

export default Comment;
