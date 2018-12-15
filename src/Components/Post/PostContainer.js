import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostContract from '../../contracts/Post.json';
import CircularProgress from '@material-ui/core/CircularProgress';
import Post from './Post';
import ipfs from '../../ipfs'

class PostContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: null,
      creator: null,
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
    post.at(this.props.address).then((instance) => {
      instance.postInfo.call().then((result) => {
        console.log(result)
        ipfs.catJSON(result[0], (err, ipfsData) => {
          console.log(ipfsData)
          var utcSeconds = ipfsData.time;
          var time = new Date(0); 
          time.setUTCSeconds(utcSeconds / 1000);
          time = time.toString();
          this.setState({
            title: ipfsData.title,
            creator: ipfsData.creator,
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
        <CircularProgress />
      )
    } else {
      return (
        <Post
          address={this.props.address}
          title={this.state.title}
          creator={this.state.creator}
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
  };
}

export default connect(mapStateToProps)(PostContainer);

