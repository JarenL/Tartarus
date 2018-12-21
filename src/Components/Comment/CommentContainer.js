import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostContract from '../../contracts/Post.json';
import Loading from '../Loading'
import Comment from './Comment';
import ipfs from '../../ipfs'

class CommentContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comment: null,
      creator: null,
      post: null,
      forum: null,
      target: null,
      time: null,
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
    post.at(this.props.currentPostAddress).then((instance) => {
      instance.getComment(this.props.address).then((result) => {
        console.log(result)
        ipfs.catJSON(result[0], (err, ipfsData) => {
          console.log(ipfsData)
          var utcSeconds = result[3];
          var time = new Date(0); 
          time.setUTCSeconds(utcSeconds);
          time = time.toString();
          this.setState({
            comment: ipfsData.comment,
            creator: result[1],
            target: result[2],
            time: time,
            loading: false
          });
        })
      })
    })
  }

  render() {
    if (this.state.loading) {
      return (
        <Loading />
      )
    } else {
      return (
        <Comment
          address={this.props.address}
          comment={this.state.comment}
          creator={this.state.creator}
          target={this.state.target}
          time={this.state.time}
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
    currentPostAddress: state.forum.currentPostAddress
  };
}

export default connect(mapStateToProps)(CommentContainer);

