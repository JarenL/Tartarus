import React from 'react';
import Empty from '../../shared/Empty';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner';
import { updateUserPermissions } from '../../../redux/actions/actions';
import PostListItem from './Item';
import ReactList from 'react-list';

const blocksInDay = 5760;

class PostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
      sorted: false,
      latest: null
    };
    this.instantiateContract = this.instantiateContract.bind(this);
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

    if (newProps.type !== this.props.type) {
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

  handlePostType = props => {
    switch (this.props.type) {
      case 'top':
        this.handleTop(props);
        break;
      case 'hot':
        this.handleHot(props);
        break;
      case 'new':
        this.handleNew(props);
        break;
      case 'old':
        break;
      default:
        break;
    }
  };

  handleHot = props => {
    console.log('hot');
    let sortedPosts = props.sort(
      (a, b) => parseFloat(b.hotWeight) - parseFloat(a.hotWeight)
    );
    this.setState({
      posts: sortedPosts,
      loading: false
    });
  };

  handleTop = props => {
    console.log('top');
    let sortedPosts = props.sort((a, b) => b.votes - a.votes);
    this.setState({
      posts: sortedPosts,
      loading: false
    });
  };

  handleNew = props => {
    console.log('new');
    let sortedPosts = props.reverse();
    this.setState({
      posts: sortedPosts,
      loading: false
    });
  };

  getPosts = async props => {
    let results = await Promise.all(props.map(post => this.getPost(post)));
    this.handlePostType(results);
  };

  getPost = async props => {
    console.log('getpost');
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    let post = await instance.getPost.call(props.args.forum, props.args.postId);
    console.log(post)
    let newPost = props;
    newPost.votes = post[2].c[0] - post[3].c[0];
    newPost.comments = post[4].c[0];
    newPost.hotWeight = this.getHot(newPost);
    return newPost;
  };

  getHot = props => {
    // console.log(props);
    let xValue = props.votes;
    let tValue = Date.now() / 1000 - props.args.time.c[0];
    // console.log(Date.now())
    // console.log(props.args.time.c[0]);
    let yValue;
    if (xValue > 0) {
      yValue = 1;
    } else if (xValue === 0) {
      yValue = 0;
    } else if (xValue < 0) {
      yValue = -1;
    }
    let zValue = Math.abs(props.votes) >= 1 ? Math.abs(props.votes) : 1;

    // console.log(xValue)
    // console.log(yValue)
    // console.log(zValue)
    // console.log(tValue)

    return Math.log10(zValue) + (yValue * tValue) / 45000;
  };

  instantiateContract = () => {
    const contract = require('truffle-contract');
    if (this.props.forumName === undefined) {
      if (this.props.user === undefined) {
        //front page
        console.log('front');
        const tartarus = contract(TartarusContract);
        tartarus.setProvider(this.props.web3.currentProvider);
        tartarus
          .at(this.props.tartarusAddress)
          .then(instance => {
            this.handlePostTime().then(starting => {
              instance
                .PostCreated({}, { fromBlock: starting, toBlock: 'latest' })
                .get(async (error, posts) => {
                  await this.getPosts(posts);
                });
            });
          })
          .catch(err => {
            console.log('error');
          });
      } else {
        // user page
        if (this.props.votes) {
          console.log('votes');
          if (this.props.username === this.props.user) {
            const tartarus = contract(TartarusContract);
            tartarus.setProvider(this.props.web3.currentProvider);
            tartarus
              .at(this.props.tartarusAddress)
              .then(instance => {
                this.handlePostTime().then(starting => {
                  instance
                    .UserVoted(
                      {
                        user: this.props.web3.utils.fromAscii(this.props.user)
                      },
                      {
                        fromBlock: starting,
                        toBlock: 'latest'
                      }
                    )
                    .get(async (error, posts) => {
                      await posts.forEach(function(post) {
                        post.args.postId = post.args.contentId;
                        post.args.creator = post.args.user;
                      });
                      console.log(posts)
                      await this.getPosts(posts);
                    });
                });
              })
              .catch(err => {
                console.log('error');
              });
          } else {
            this.setState({
              loading: false
            });
          }
        } else {
          console.log('user');
          const tartarus = contract(TartarusContract);
          tartarus.setProvider(this.props.web3.currentProvider);
          tartarus
            .at(this.props.tartarusAddress)
            .then(instance => {
              this.handlePostTime().then(starting => {
                instance
                  .PostCreated(
                    {
                      creator: this.props.web3.utils.fromAscii(this.props.user)
                    },
                    {
                      fromBlock: starting,
                      toBlock: 'latest'
                    }
                  )
                  .get(async (error, posts) => {
                    await this.getPosts(posts);
                  });
              });
            })
            .catch(err => {
              console.log('error');
            });
        }
      }
    } else {
      //forum page
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
          this.handlePostTime().then(starting => {
            instance
              .PostCreated(
                {
                  forum: this.props.web3.utils.fromAscii(this.props.forumName)
                },
                { fromBlock: starting, toBlock: 'latest' }
              )
              .get(async (error, posts) => {
                await this.getPosts(posts);
              });
          });
        })
        .catch(err => {
          console.log('error');
        });
    }
  };

  renderItem(index, key) {
    return <PostListItem key={key} post={this.state.posts[index].args} />;
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.posts || this.state.posts.length === 0) return <Empty />;
    return (
      <ReactList
        itemRenderer={this.renderItem.bind(this)}
        length={this.state.posts.length}
        type='simple'
      />
    );
  }
}

export default PostList;
