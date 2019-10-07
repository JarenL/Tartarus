import React, { Component } from 'react';
import ReactList from 'react-list';
import TartarusContract from '../../contracts/Tartarus.json';
import PostListItem from '../Post/PostList/Item';
import Empty from '../shared/Empty';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';
import CommentListItem from '../Comment/CommentList/Item.js';

const blocksInDay = 5760;

class CombinedList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      combinedList: [],
      loading: true
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

  getPosts = async props => {
    return await Promise.all(props.map(post => this.getPost(post)));
    // this.handlePostType(results);
  };

  getPost = async props => {
    console.log('getpost');
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    let post = await instance.getPost.call(props.args.forum, props.args.postId);
    let newPost = props;
    newPost.votes = post[2].c[0] - post[3].c[0];
    newPost.comments = post[4].c[0];
    // newPost.hotWeight = this.getHot(newPost);
    return newPost;
  };

  instantiateContract = async () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    if (this.props.saved) {
      if (this.props.user === this.props.username) {
        let savedPosts = this.props.userSettings[this.props.username].saved
          .posts;
        let savedComments = this.props.userSettings[this.props.username].saved
          .comments;
        await savedComments.forEach(function(comment) {
          let c = [];
          c.push(comment.args.time);
          comment.args.time = {};
          comment.args.time.c = c;
        });

        await savedPosts.forEach(function(post) {
          let c = [];
          c.push(post.args.time);
          post.args.time = {};
          post.args.time.c = c;
        });

        let gotPosts = await this.getPosts(savedPosts);
        let combinedList = savedComments.concat(gotPosts);
        combinedList.sort(
          (a, b) => parseFloat(a.args.time.c[0]) - parseFloat(b.args.time.c[0])
        );
        this.setState({
          combinedList: combinedList.reverse(),
          loading: false
        });
      } else {
        this.setState({
          loading: false
        });
      }
    } else {
      if (this.props.watched) {
        if (this.props.user === this.props.username) {
          let watchedPosts = this.props.userSettings[this.props.username]
            .watched.posts;
          let watchedComments = this.props.userSettings[this.props.username]
            .watched.comments;
          await watchedComments.forEach(function(comment) {
            let c = [];
            c.push(comment.args.time);
            comment.args.time = {};
            comment.args.time.c = c;
          });

          await watchedPosts.forEach(function(post) {
            let c = [];
            c.push(post.args.time);
            post.args.time = {};
            post.args.time.c = c;
          });

          let gotPosts = await this.getPosts(watchedPosts);
          let combinedList = watchedComments.concat(gotPosts);
          combinedList.sort(
            (a, b) =>
              parseFloat(a.args.time.c[0]) - parseFloat(b.args.time.c[0])
          );
          this.setState({
            combinedList: combinedList.reverse(),
            loading: false
          });
        } else {
          this.setState({
            loading: false
          });
        }
      } else {
        tartarus
          .at(this.props.tartarusAddress)
          .then(instance => {
            this.handlePostTime().then(starting => {
              instance
                .CommentCreated(
                  {
                    user: this.props.web3.utils.fromAscii(this.props.user)
                  },
                  { fromBlock: starting, toBlock: 'latest' }
                )
                .get((error, comments) => {
                  instance
                    .PostCreated(
                      {
                        user: this.props.web3.utils.fromAscii(this.props.user)
                      },
                      { fromBlock: starting, toBlock: 'latest' }
                    )
                    .get(async (error, posts) => {
                      instance
                        .UserVoted(
                          {
                            user: this.props.web3.utils.fromAscii(
                              this.props.user
                            )
                          },
                          {
                            fromBlock: starting,
                            toBlock: 'latest'
                          }
                        )
                        .get(async (error, votes) => {
                          let gotPosts = await this.getPosts(posts);
                          let votePosts = await this.getPosts(votes);
                          let combinedList = comments.concat(gotPosts);
                          combinedList = combinedList.concat(votePosts);
                          combinedList.sort(
                            (a, b) =>
                              parseFloat(a.args.time.c[0]) -
                              parseFloat(b.args.time.c[0])
                          );
                          this.setState({
                            combinedList: combinedList.reverse(),
                            loading: false
                          });
                        });
                    });
                });
            });
          })
          .catch(err => {
            console.log('error');
          });
      }
    }
  };

  renderItem(index, key) {
    if (this.state.combinedList[index].event === 'CommentCreated') {
      return (
        <CommentListItem
          index={index}
          // handleScroll={this.handleScrollTo}
          // handleParentHover={this.handleParentHover}
          // parentHover={this.state.parentHover}
          key={this.state.combinedList[index].args.commentId}
          forumName={this.props.forumName}
          comment={this.state.combinedList[index]}
          disabled={true}
          direct={true}
          // currentComment={this.state.currentComment}
          // focused={
          //   this.state.focusedCommentsMap[
          //     this.state.comments[index].args.commentId
          //   ]
          //     ? true
          //     : false
          // }
          // handleReply={this.handleReply}
          // handleFocus={this.handleFocus}
        />
      );
    } else {
      return (
        <PostListItem key={key} post={this.state.combinedList[index].args} />
      );
    }
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.combinedList || this.state.combinedList.length === 0) {
      return <Empty />;
    }
    return (
      <ReactList
        itemRenderer={this.renderItem.bind(this)}
        length={this.state.combinedList.length}
        type='simple'
      />
    );
  }
}

export default CombinedList;
