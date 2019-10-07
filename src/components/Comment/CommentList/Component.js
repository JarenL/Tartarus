import React, { Component } from 'react';
import ReactList from 'react-list';
import CommentListItem from './Item';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner';
import { updateUserPermissions } from '../../../redux/actions/actions';
import Empty from '../../shared/Empty';

const blocksInDay = 5760;

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      loading: true,
      parentHover: null,
      currentComment: null,
      focusedCommentsList: [],
      focusedCommentsMap: {},
      focusedChildren: []
    };
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  componentDidUpdate = (newProps, oldProps) => {
    if (newProps.time !== this.props.time) {
      this.setState({
        loading: true
      });
      this.instantiateContract();
    }

    if (newProps.username !== this.props.username) {
      this.setState({
        loading: true
      });
      this.instantiateContract();
    }
  };

  handlePostTime = async () => {
    const latest = await this.props.web3.eth.getBlock('latest');
    switch (this.props.time) {
      case 'day':
        return latest.number - 1 * blocksInDay;
      case 'week':
        return latest.number - 7 * blocksInDay;
      case 'month':
        return latest.number - 30 * blocksInDay;
      case 'year':
        return latest.number - 365 * blocksInDay;
      case 'all':
        return 0;
      default:
        return null;
    }
  };

  instantiateContract = () => {
    const contract = require('truffle-contract');
    if (this.props.postId === undefined) {
      if (this.props.user === undefined) {
        //comment page
        const tartarus = contract(TartarusContract);
        tartarus.setProvider(this.props.web3.currentProvider);
        tartarus
          .at(this.props.tartarusAddress)
          .then(instance => {
            this.handlePostTime().then(starting => {
              instance
                .CommentCreated(
                  { postId: this.props.postId },
                  { fromBlock: starting, toBlock: 'latest' }
                )
                .get((error, comments) => {
                  console.log(comments);
                  this.setState({
                    comments: comments,
                    loading: false
                  });
                });
            });
          })
          .catch(err => {
            console.log('error');
          });
      } else {
        // user page
        const tartarus = contract(TartarusContract);
        tartarus.setProvider(this.props.web3.currentProvider);
        tartarus
          .at(this.props.tartarusAddress)
          .then(instance => {
            this.handlePostTime().then(starting => {
              instance
                .CommentCreated(
                  {
                    user: this.props.web3.utils.fromAscii(this.props.user)
                  },
                  {
                    fromBlock: starting,
                    toBlock: 'latest'
                  }
                )
                .get((error, comments) => {
                  this.setState({
                    comments: comments,
                    loading: false
                  });
                });
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
          instance.getModerator
            .call(
              this.props.web3.utils.fromAscii(this.props.username),
              this.props.web3.utils.fromAscii(this.props.forumName)
            )
            .then(moderator => {
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
              if (this.props.commentId !== undefined) {
                let directCommentIndex = comments
                  .map(function(comment) {
                    return comment.args.commentId;
                  })
                  .indexOf(this.props.commentId);
                this.setState({
                  directComment: comments[directCommentIndex],
                  comments: comments,
                  loading: false
                });
                if (this.state.directComment !== null) {
                  console.log(this.state.directComment);
                  this.handleFocus(this.state.directComment);
                  this.handleScrollTo(this.props.commentId);
                }
              } else {
                this.setState({
                  comments: comments,
                  loading: false
                });
              }
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

  handleParentHover = props => {
    this.setState({
      parentHover: props
    });
  };

  handleFocus = props => {
    if (this.state.focusedCommentsMap[props.args.commentId] !== undefined) {
      // remove focus
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
        focusedChildren: newFocusedChildren
      });
    } else {
      // add focus
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
      let newFocusedCommentsMap = newFocusedCommentsList.reduce(
        (map, comment) => ((map[comment.args.commentId] = true), map),
        {}
      );
      this.setState({
        focusedCommentsList: newFocusedCommentsList,
        focusedCommentsMap: newFocusedCommentsMap,
        focusedChildren: newFocusedChildren
      });
    }
  };

  handleScrollTo = props => {
    // console.log(props);
    // console.log(this.list);
    let parentIndex = this.state.comments
      .map(function(e) {
        console.log(e);
        return e.args.commentId;
      })
      .indexOf(props);
    // console.log(parentIndex);
    this.list.scrollTo(parentIndex);
  };

  renderItem(index, key) {
    return (
      <CommentListItem
        index={index}
        handleScroll={this.handleScrollTo}
        handleParentHover={this.handleParentHover}
        parentHover={this.state.parentHover}
        key={this.state.comments[index].args.commentId}
        forumName={this.props.forumName}
        comment={this.state.comments[index]}
        currentComment={this.state.currentComment}
        focused={
          this.state.focusedCommentsMap[
            this.state.comments[index].args.commentId
          ]
            ? true
            : false
        }
        handleReply={this.handleReply}
        handleFocus={this.handleFocus}
        disabled={this.props.disabled}
        direct={this.props.direct}
      />
    );
  }

  renderFocusedItem(index, key) {
    let lastIndex = this.state.comments
      .map(comment => {
        return comment.args.commentId;
      })
      .indexOf(this.state.focusedCommentsList[0].args.commentId);
    let rootCommentList = this.state.comments.slice(0, lastIndex);
    let combinedList = rootCommentList.concat(
      this.state.focusedCommentsList,
      this.state.focusedChildren
    );
    // console.log(this.state.focusedCommentsList);
    // let combinedList = this.state.focusedCommentsList.concat(
    //   this.state.focusedChildren
    // );
    return (
      <CommentListItem
        index={index}
        handleParentHover={this.handleParentHover}
        parentHover={this.state.parentHover}
        handleScroll={this.handleScrollTo}
        key={combinedList[index].args.commentId}
        forumName={this.props.forumName}
        comment={combinedList[index]}
        currentComment={this.state.currentComment}
        focused={
          this.state.focusedCommentsMap[combinedList[index].args.commentId]
            ? true
            : false
        }
        handleReply={this.handleReply}
        handleFocus={this.handleFocus}
        disabled={this.props.disabled}
      />
    );
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.comments || this.state.comments.length === 0)
      return <Empty />;
    if (this.state.focusedCommentsList.length > 0) {
      let lastIndex = this.state.comments
        .map(comment => {
          return comment.args.commentId;
        })
        .indexOf(this.state.focusedCommentsList[0].args.commentId);
      return (
        <ReactList
          ref={c => (this.list = c)}
          itemRenderer={this.renderFocusedItem.bind(this)}
          length={
            lastIndex +
            this.state.focusedCommentsList.length +
            this.state.focusedChildren.length
          }
          type='simple'
        />
      );
    } else {
      return (
        <ReactList
          ref={c => (this.list = c)}
          itemRenderer={this.renderItem.bind(this)}
          length={this.state.comments.length}
          type='simple'
        />
      );
    }
  }
}

export default CommentList;
