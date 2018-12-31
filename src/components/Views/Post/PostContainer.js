import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostContract from '../../../contracts/Post.json';
import Loading from '../../Loading'
import Post from './Post';
import ipfs from '../../../services/ipfs/ipfs'

const styles = {
  center: {
    marginLeft: "auto",
    marginRight: "auto",
  }
}

class PostContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: null,
      creator: null,
      forum: null,
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
    const post = contract(PostContract)
    post.setProvider(this.props.web3.currentProvider)
    post.at(this.props.address).then((instance) => {
      instance.postInfo.call().then((result) => {
        instance.owner.call().then((owner) => {
          ipfs.catJSON(result[0], (err, ipfsData) => {
            if (ipfsData) {
              this.setState({
                title: ipfsData.title,
                creator: result[1],
                forum: owner,
                time: result[2].c[0] * 1000,
                loading: false,
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
          <div className={styles.center}>
            <Loading />
          </div>
        )
      } else {
        return null
      }

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

