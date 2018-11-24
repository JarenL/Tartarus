import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostContract from '../../../build/contracts/Post.json';
import CircularProgress from '@material-ui/core/CircularProgress';
import Post from './Post';

class PostContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: null,
      creator: null,
      loading: true
    }
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const post = contract(PostContract)
    post.setProvider(this.props.web3.currentProvider)
    post.at(this.props.address).then((instance) => {
      instance.forumInfo.call().then((result) => {
        this.setState({
          title: result[0],
          creator: result[1],
          loading: false
        });
      })
    })
  }
  render() {
    if (this.state.loading) {
      return (
        <CircularProgress />
      )
    } else {
      return (
        <Post
          address={this.state.address}
          title={this.state.title}
          creator={this.state.creator}

        />
      )
    }
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    accounts: state.accounts,
    tartarusAddress: state.tartarus.tartarusAddress,
  };
}

export default connect(mapStateToProps)(PostContainer);

