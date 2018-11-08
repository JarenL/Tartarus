import React, { Component } from 'react';
import PostList from '../Components/PostList';
import { connect } from 'react-redux';
import ForumContract from '../../build/contracts/Forum.json';

class PostListContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      forumAddress: this.props.forumAddress
    }
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const forum = contract(ForumContract)
    forum.setProvider(this.props.web3.currentProvider)
    forum.at(this.state.forumAddress).then((instance) => {
      const postCreationEvent = instance.allEvents({ fromBlock: 0, toBlock: 'latest' });
      postCreationEvent.watch((error, result) => {
        if (!error) {
          if (result.event === "PostCreated") {
            let newPostArray = this.state.posts.slice();
            newPostArray.push({
              address: result.args.postAddress,
              title: result.args.postTitle,
              author: result.args.postOwner
            });
            this.setState({
              posts: newPostArray
            });
          }
        }
      })
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
  };
}

export default connect(mapStateToProps)(PostListContainer);
