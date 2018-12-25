import React, { Component } from 'react';
import { connect } from 'react-redux';
import CommentContract from '../../../contracts/Comment.json';
import Loading from '../../Loading'
import Comment from './Comment';
import ipfs from '../../../services/ipfs/ipfs'

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
      loading: true,
      exists: true
    }
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const comment = contract(CommentContract)
    comment.setProvider(this.props.web3.currentProvider)
    comment.at(this.props.address).then((instance) => {
      instance.commentInfo.call().then((result) => {
        instance.owner.call().then((owner) => {
          ipfs.catJSON(result[0], (err, ipfsData) => {
            if (ipfsData) {
              var utcSeconds = result[2];
              var time = new Date(0);
              time.setUTCSeconds(utcSeconds / 1000);
              time = time.toString();
              this.setState({
                title: ipfsData.title,
                creator: result[1],
                post: owner,
                time: time,
                loading: false
              });
            } else {
              this.setState({
                exists: false
              })
            }
          })
        })
      })
    })
  }

  render() {
    if (this.state.loading) {
      if (this.state.exists) {
        return (
            <Loading />
        )
      } else {
        return null
      }
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

