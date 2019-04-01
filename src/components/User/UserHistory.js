import { connect } from 'react-redux';
// import PostList from './PostList';
import React from 'react';
import Empty from '../shared/Empty';
import UserContract from '../../contracts/User.json';
import TartarusContract from '../../contracts/Tartarus.json';

class UserHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true
    };
  }

  render() {
    // if (this.state.loading) return <LoadingIndicatorSpinner />;
    // if (!this.state.posts || this.state.posts.length === 0) return <Empty />;
    // return <PostList posts={this.state.posts} />;
    return <Empty />;
  }
}

export const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress
});

export default connect(mapStateToProps)(UserHistory);
