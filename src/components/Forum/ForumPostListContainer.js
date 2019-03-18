import { connect } from 'react-redux';
import React from 'react';
import Empty from '../shared/Empty';
import ForumContract from '../../contracts/Forum.json';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';
import PostList from '../PostList/PostList';

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

  instantiateContract() {
    const contract = require('truffle-contract');
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

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.posts || this.state.posts.length === 0) return <Empty />;
    return <PostList posts={this.state.posts} />;
  }
}

export const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress
});

export default connect(mapStateToProps)(PostListContainer);
