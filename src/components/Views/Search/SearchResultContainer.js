import React, { Component } from 'react';
import { connect } from 'react-redux';
import TartarusContract from '../../../contracts/Tartarus.json';
import ForumResultList from './Forum/ForumResultList'
import Loading from '../../Loading'

class SearchResultContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      forums: [],
      posts: [],
      comments: [],
      users: [],
      loading: true
    }
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const tartarus = contract(TartarusContract)
    tartarus.setProvider(this.props.web3.currentProvider)
    tartarus.at(this.props.tartarusAddress).then((instance) => {
      instance.ForumCreated({}, { fromBlock: 0, toBlock: 'latest' }).get((error, result) => {
        let newForumsList = this.state.forums.slice()
        result.forEach((forum) => {
          newForumsList.push({
            address: forum.args.forumAddress
          })
          this.setState({
            forums: newForumsList
          })
        })
        this.setState({
          loading: false
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
          <ForumResultList forums={this.state.forums}/>
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

export default connect(mapStateToProps)(SearchResultContainer);
