import React, { Component } from 'react';
import PostList from './PostList';
import { connect } from 'react-redux';
import ForumContract from '../../../contracts/Forum.json';

class PostListContainer extends Component {
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

  componentDidUpdate = (newProps) => {
    if (newProps.currentForumAddress !== this.props.currentForumAddress) {
      this.setState({
        posts: []
      })
      this.instantiateContract()
    }
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const forum = contract(ForumContract)
    forum.setProvider(this.props.web3.currentProvider)
    forum.at(this.props.currentForumAddress).then((instance) => {
      instance.PostCreated({}, { fromBlock: 0, toBlock: 'latest' }).get((error, result) => {
        this.setState({
          posts: result,
          loading: false
        });
      });
    })
  }

  render() {
    return (
      <div>
        <PostList posts={this.state.posts} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    web3: state.web3,
    accounts: state.accounts,
    currentForum: state.forum.currentForum,
    currentForumAddress: state.forum.currentForumAddress,
  };
}

export default connect(mapStateToProps)(PostListContainer);
