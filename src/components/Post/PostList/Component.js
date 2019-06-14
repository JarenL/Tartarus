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
      topPosts: [],
      loading: true,
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
    this.setState({
      posts: []
    })
    switch (this.props.type) {
      case 'top':
        return this.handleTop(props);
      case 'hot':
        return this.handleHot(props);
      case 'new':
        return props.reverse();
      case 'old':
        return props;
      default:
        return props;
    }
  };

  handleHot = async props => {
    console.log('hot')
    await Promise.all(
      props.map(post => this.getPost(post))
    );

    console.log(this.state.posts)

    return this.state.posts.sort(function(a,b) { return parseFloat(b.hotWeight) - parseFloat(a.hotWeight) } );
  }

  handleTop = async props => {
    console.log('top');
    console.log(props)
    await Promise.all(
      props.map(post => this.getPost(post))
    );
    // this.instantiateContract();
    return this.state.posts.sort(function(a,b) { return parseFloat(b.votes) - parseFloat(a.votes) } );
  };

  getPost = props => {
    console.log('getpost')
    // console.log(props)

    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    tartarus
      .at(this.props.tartarusAddress)
      .then(instance => {
        instance.getPost
          .call(props.args.forum, props.args.postId)
          .then(post => {
            console.log(props)
            // console.log(post)
            let newPost = props;
            newPost.votes = post[2].c[0] - post[3].c[0];
            newPost.comments = post[4].c[0];
            newPost.hotWeight = this.getHot(newPost)
            
            let topPostList = this.state.posts;
            topPostList.push(newPost);
            this.setState({
              posts: topPostList
            })
          });
      })
      .catch(err => {
        console.log('error');
      });
  };

  getHot = props => {
    console.log(props)
    let xValue = props.votes;
    let tValue = Date.now() - props.args.time.c[0];
    let yValue;
    if (xValue > 0) {
      yValue = 1;
    } else if (xValue = 0) {
      yValue = 0;
    } else if (xValue < 0) {
      yValue = -1;
    }

    let zValue = Math.abs(props.votes) >= 0 ? Math.abs(props.votes) : 1
    console.log(Math.log10(zValue) + ((yValue * tValue) / 45000))
    return Math.log10(zValue) + ((yValue * tValue) / 45000)
  }

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
                  this.setState({
                    posts: await this.handlePostType(posts),
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
                  this.setState({
                    posts: await this.handlePostType(posts),
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
                console.log(posts);
                this.setState({
                  posts: await this.handlePostType(posts),
                  loading: false
                });
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
