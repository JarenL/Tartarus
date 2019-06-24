import React, { Component } from 'react';
import ReactList from 'react-list';
import CommentListItem from './Item';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner';
import { updateUserPermissions } from '../../../redux/actions/actions';
import Empty from '../../shared/Empty';

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      loading: true,
      currentComment: null,
      focusedCommentsList: [],
      focusedCommentsMap: {},
      focusedChildren: []
    };
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  instantiateContract = () => {
    const contract = require('truffle-contract');
    console.log(this.props);
    if (this.props.postId === undefined) {
      if (this.props.user === undefined) {
        //comment page
        console.log('comment');
        const tartarus = contract(TartarusContract);
        tartarus.setProvider(this.props.web3.currentProvider);
        tartarus
          .at(this.props.tartarusAddress)
          .then(instance => {
            instance
              .CommentCreated(
                { postId: this.props.postId },
                { fromBlock: 0, toBlock: 'latest' }
              )
              .get((error, comments) => {
                this.setState({
                  comments: comments,
                  loading: false
                });
                console.log(comments);
              });
          })
          .catch(err => {
            console.log('error');
          });
      } else {
        // user page
        console.log('user');
        const tartarus = contract(TartarusContract);
        tartarus.setProvider(this.props.web3.currentProvider);
        tartarus
          .at(this.props.tartarusAddress)
          .then(instance => {
            instance
              .CommentCreated(
                {
                  creator: this.props.web3.utils.fromAscii(this.props.user)
                },
                {
                  fromBlock: 0,
                  toBlock: 'latest'
                }
              )
              .get((error, comments) => {
                this.setState({
                  comments: comments,
                  loading: false
                });
                console.log(comments);
              });
          })
          .catch(err => {
            console.log('error');
          });
      }
    } else {
      //post page
      const tartarus = contract(TartarusContract);
      tartarus.setProvider(this.props.web3.currentProvider);
      tartarus
        .at(this.props.tartarusAddress)
        .then(instance => {
          console.log(this.props.forumName);
          console.log(this.props.username);
          instance.getModerator
            .call(
              this.props.web3.utils.fromAscii(this.props.username),
              this.props.web3.utils.fromAscii(this.props.forumName)
            )
            .then(moderator => {
              console.log(moderator);
              let permissionsObject = {
                type: 'moderator',
                permissions: moderator
              };
              this.props.dispatch(updateUserPermissions(permissionsObject));
            });
          instance
            .CommentCreated(
              {
                postId: this.props.postId
              },
              { fromBlock: 0, toBlock: 'latest' }
            )
            .get((error, comments) => {
              console.log(comments);
              this.setState({
                comments: comments,
                loading: false
              });
            });
        })
        .catch(err => {
          console.log('error');
        });
    }
  };

  handleReply = props => {
    if (props === this.state.currentComment) {
      this.setState({
        currentComment: null
      });
    } else {
      this.setState({
        currentComment: props
      });
    }
  };

  handleFocus = props => {
    console.log('focus');
    console.log(props)
    if (this.state.focusedCommentsMap[props.args.commentId] !== undefined) {
      let newFocusedCommentsList = this.state.focusedCommentsList;
      let removedFocus = newFocusedCommentsList
        .map(comment => {
          return comment.args.commentId;
        })
        .indexOf(props.args.commentId);
      newFocusedCommentsList.splice(
        removedFocus,
        newFocusedCommentsList.length
      );
      console.log(newFocusedCommentsList.length);
      let newFocusedChildren;
      if (newFocusedCommentsList.length !== 0) {
        newFocusedChildren = this.state.comments.filter(comment => {
          if (
            comment.args.targetId ===
            newFocusedCommentsList[newFocusedCommentsList.length - 1].args
              .commentId
          ) {
            return true;
          } else {
            return false;
          }
        });
      } else {
        newFocusedChildren = [];
      }

      let newFocusedCommentsMap = newFocusedCommentsList.reduce(
        (map, comment) => ((map[comment.args.commentId] = true), map),
        {}
      );
      this.setState({
        focusedCommentsList: newFocusedCommentsList,
        focusedCommentsMap: newFocusedCommentsMap,
        focusedChildren: newFocusedChildren,
        focusedCombined: newFocusedCommentsList.concat(newFocusedChildren)
      });
    } else {
      let newFocusedCommentsList = this.state.focusedCommentsList;
      newFocusedCommentsList.push(props);
      let newFocusedChildren = this.state.comments.filter(comment => {
        if (
          comment.args.targetId ===
          newFocusedCommentsList[newFocusedCommentsList.length - 1].args
            .commentId
        ) {
          return true;
        } else {
          return false;
        }
      });
      console.log(newFocusedChildren);
      let newFocusedCommentsMap = newFocusedCommentsList.reduce(
        (map, comment) => ((map[comment.args.commentId] = true), map),
        {}
      );
      console.log(newFocusedCommentsMap);
      this.setState({
        focusedCommentsList: newFocusedCommentsList,
        focusedCommentsMap: newFocusedCommentsMap,
        focusedChildren: newFocusedChildren,
        focusedCombined: newFocusedCommentsList.concat(newFocusedChildren)
      });
    }
    console.log(this.state.focusedCommentsList);
  };

  renderItem(index, key) {
    return (
      <CommentListItem
        key={key}
        forumName={this.props.forumName}
        comment={this.state.comments[index]}
        currentComment={this.state.currentComment}
        focusedComment={
          this.state.focusedCommentsMap[
            this.state.comments[index].args.commentId
          ]
            ? true
            : false
        }
        handleReply={this.handleReply}
        handleFocus={this.handleFocus}
      />
    );
  }

  renderFocusedItem(index, key) {
    // console.log(combinedList.length);
    // console.log(combinedList[0])
    // console.log(combinedList[index].args.commentId)
    return (
      <CommentListItem
        key={key}
        forumName={this.props.forumName}
        comment={this.state.focusedCombined[index]}
        currentComment={this.state.currentComment}
        focused={
          this.state.focusedCommentsMap[this.state.focusedCombined[index].args.commentId]
            ? true
            : false
        }
        handleReply={this.handleReply}
        handleFocus={this.handleFocus}
      />
    );
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.comments || this.state.comments.length === 0)
      return <Empty />;
    if (this.state.focusedCommentsList.length !== 0) {
      return (
        <ReactList
          itemRenderer={this.renderFocusedItem.bind(this)}
          length={
            this.state.focusedCommentsList.length +
            this.state.focusedChildren.length
          }
          type='simple'
        />
      );
    } else {
      return (
        <ReactList
          itemRenderer={this.renderItem.bind(this)}
          length={this.state.comments.length}
          type='simple'
        />
      );
    }
  }
}

export default CommentList;
