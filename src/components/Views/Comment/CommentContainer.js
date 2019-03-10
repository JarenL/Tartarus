import React, { Component } from 'react';
import { connect } from 'react-redux';
import CommentContract from '../../../contracts/Comment.json';
import Loading from '../../Loading'
import Comment from './Comment';
import PostContract from '../../../contracts/Post.json';
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
      commentReplies: null,
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
    const post = contract(PostContract)
    const comment = contract(CommentContract)
    post.setProvider(this.props.web3.currentProvider)
    comment.setProvider(this.props.web3.currentProvider)
    post.at(this.props.currentPostAddress).then((postInstance) => {
      postInstance.CommentCreated({targetAddress: this.props.address}, {fromBlock: 0, toBlock: 'latest'}).get((error, commentReplies) => {
        console.log(commentReplies)
        postInstance.owner.call().then((owner) => {
          console.log(this.props)
          comment.at(this.props.address).then((instance) => {
            instance.commentInfo.call().then((result) => {
              console.log(result)
              const bs58 = require('bs58')
              const hashHex = "1220" + result[0].slice(2)
              const hashBytes = Buffer.from(hashHex, "hex")
              const ipfsHash = bs58.encode(hashBytes)
              console.log(ipfsHash)
              ipfs.catJSON(ipfsHash, (err, ipfsData) => {
                console.log(ipfsData)
                if (ipfsData) {
                  this.setState({
                    title: ipfsData.title,
                    comment: ipfsData.comment,
                    commentReplies: commentReplies.length, 
                    creator: result[1],
                    target: result[2],
                    votes: result[4].c[0],
                    forum: owner,
                    post: this.props.currentPostAddress,
                    time: result[3].c[0] * 1000,
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
          commentReplies={this.state.commentReplies}
          creator={this.state.creator}
          target={this.state.target}
          time={this.state.time}
          votes={this.state.votes}
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

