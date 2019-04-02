import { connect } from 'react-redux';
import React from 'react';
import Empty from '../shared/Empty';
import UserContract from '../../contracts/User.json';
import TartarusContract from '../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';
import PostList from './InfinitePostList';

const blocksInDay = 5760;

class PostListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
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
        return null;
      case 'hot':
        return null;
      case 'new':
        return props.reverse();
      case 'old':
        return props;
      default:
        return props;
    }
  };

  instantiateContract = () => {
    const contract = require('truffle-contract');
    if (this.props.forumAddress === undefined) {
      if (this.props.username === undefined) {
        //front page
        const tartarus = contract(TartarusContract);
        tartarus.setProvider(this.props.web3.currentProvider);
        tartarus
          .at(this.props.tartarusAddress)
          .then(instance => {
            this.handlePostTime().then(starting => {
              instance
                .PostCreated({}, { fromBlock: starting, toBlock: 'latest' })
                .get((error, posts) => {
                  this.setState({
                    posts: this.handlePostType(posts),
                    loading: false
                  });
                });
            });
          })
          .catch(err => {
            console.log('error');
          });
      } else {
        const user = contract(UserContract);
        const tartarus = contract(TartarusContract);
        user.setProvider(this.props.web3.currentProvider);
        tartarus.setProvider(this.props.web3.currentProvider);
        this.props.web3.eth.getAccounts((error, accounts) => {
          tartarus.at(this.props.tartarusAddress).then(instance => {
            instance.users
              .call(this.props.username, {
                from: accounts[0],
                gasPrice: 20000000000
              })
              .then(userAddress => {
                tartarus
                  .at(this.props.tartarusAddress)
                  .then(instance => {
                    this.handlePostTime().then(starting => {
                      instance
                        .PostCreated(
                          { creatorAddress: userAddress },
                          {
                            fromBlock: starting,
                            toBlock: 'latest'
                          }
                        )
                        .get((error, posts) => {
                          this.setState({
                            posts: this.handlePostType(posts),
                            loading: false
                          });
                          console.log(posts);
                        });
                    });
                  })
                  .catch(err => {
                    console.log('error');
                  });
              });
          });
        });
      }
    } else {
      //forum page
      const tartarus = contract(TartarusContract);
      tartarus.setProvider(this.props.web3.currentProvider);
      tartarus
        .at(this.props.tartarusAddress)
        .then(instance => {
          this.handlePostTime().then(starting => {
            instance
              .PostCreated(
                { forumAddress: this.props.forumAddress },
                { fromBlock: starting, toBlock: 'latest' }
              )
              .get((error, posts) => {
                this.setState({
                  posts: this.handlePostType(posts),
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

  render() {
    console.log(this.props.time);
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.posts || this.state.posts.length === 0) return <Empty />;
    return <PostList posts={this.state.posts} time={this.props.time} />;
  }
}

export const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress,
  userAddress: state.user.userAddress,
  time: state.form.filter.values.time,
  type: state.form.filter.values.type
});

export default connect(mapStateToProps)(PostListContainer);
