import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserContract from '../../../contracts/User.json';
import Loading from '../../Loading.js';
import PostList from '../Post/PostList.js';

class PostTabContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      loading: true
    }
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const user = contract(UserContract)
    user.setProvider(this.props.web3.currentProvider)
    user.at(this.props.accounts.currentUserAddress).then((instance) => {
      instance.PostCreated({}, { fromBlock: 0, toBlock: 'latest' }).get((error, result) => {
        this.setState({
          posts: result,
          loading: false
        });
      });
    })
  }

  render() {
    if (this.state.loading) {
      return <Loading />
    } else {
      if (this.state.posts.length === 0) {
        return (
          <div>No posts</div>
        )
      } else {
        return (
          <div>
            <PostList posts={this.state.posts} />
          </div>
        )
      }
    }
  }
}

const mapStateToProps = (state) => {
  return {
    web3: state.web3,
    accounts: state.accounts
  };
}

export default connect(mapStateToProps)(PostTabContainer);
