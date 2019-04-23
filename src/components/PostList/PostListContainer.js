import { connect } from 'react-redux';
import React from 'react';
import Empty from '../shared/Empty';
import TartarusContract from '../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';
import PostList from './PostList';

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
    //todo assign post trending value
    const contract = require('truffle-contract');
    if (this.props.forumName === undefined) {
      if (this.props.username === undefined) {
        //front page
        console.log("front")
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
                  console.log(posts);
                });
            });
          })
          .catch(err => {
            console.log('error');
          });
      } else {
        console.log("user")
        const tartarus = contract(TartarusContract);
        tartarus.setProvider(this.props.web3.currentProvider);
        tartarus
          .at(this.props.tartarusAddress)
          .then(instance => {
            this.handlePostTime().then(starting => {
              instance
                .PostCreated(
                  {
                    creator: this.props.web3.utils.fromAscii(
                      this.props.username
                    )
                  },
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
                {
                  forum: this.props.web3.utils.fromAscii(this.props.forumName)
                },
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
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.posts || this.state.posts.length === 0) return <Empty />;
    return <PostList posts={this.state.posts} />;
  }
}

export const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress,
  time: state.form.filter.values.time,
  type: state.form.filter.values.type
});

export default connect(mapStateToProps)(PostListContainer);
