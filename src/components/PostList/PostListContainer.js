import { connect } from 'react-redux';
import PostList from './PostList';
import React from 'react';
import LoadingIndicatorBox from '../shared/LoadingIndicator/Box';
import Empty from '../shared/Empty';
import ForumContract from '../../contracts/Forum.json';
import TartarusContract from '../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';

class PostListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps === prevState) {
      this.setState({
        loading: false
      });
    }

  }

  instantiateContract() {
    const contract = require('truffle-contract');
    console.log(this.props);
    if (this.props.forumAddress === undefined) {
      if (this.props.username === undefined) {
        const tartarus = contract(TartarusContract);
        tartarus.setProvider(this.props.web3.currentProvider);
        tartarus
          .at(this.props.tartarusAddress)
          .then(instance => {
            instance
              .PostCreated({}, { fromBlock: 0, toBlock: 'latest' })
              .get((error, posts) => {
                this.setState({
                  posts: posts,
                  loading: false
                });
              });
          })
          .catch(err => {
            console.log('error');
          });
      } else {
        const tartarus = contract(TartarusContract);
        tartarus.setProvider(this.props.web3.currentProvider);
        tartarus
          .at(this.props.tartarusAddress)
          .then(instance => {
            instance
              .PostCreated(
                { creatorAddress: this.props.userAddress },
                { fromBlock: 0, toBlock: 'latest' }
              )
              .get((error, posts) => {
                this.setState({
                  posts: posts
                });
              });
          })
          .catch(err => {
            console.log('error');
          });
      }
    } else {
      const forum = contract(ForumContract);
      forum.setProvider(this.props.web3.currentProvider);
      forum
        .at(this.props.forumAddress)
        .then(instance => {
          instance
            .PostCreated({}, { fromBlock: 0, toBlock: 'latest' })
            .get((error, posts) => {
              this.setState({
                posts: posts,
                loading: false
              });
            });
        })
        .catch(err => {
          console.log('error');
        });
    }
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.posts || this.state.posts.length === 0) return <Empty />;
    return <PostList posts={this.state.posts} />;
  }
}

export const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress,
  userAddress: state.user.userAddress
});

export default connect(mapStateToProps)(PostListContainer);
