import React, { Component } from 'react';
import { connect } from 'react-redux';
import ForumContract from '../../../contracts/Forum.json';
import Loading from '../../Loading'

import Forum from './Forum';

class ForumContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: null,
      loading: true
    }
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const forum = contract(ForumContract)
    console.log(this.props.address)
    forum.setProvider(this.props.web3.currentProvider)
    forum.at(this.props.address).then((instance) => {
      instance.name.call().then((result) => {
        this.setState({
          name: result,
          loading: false
        });
      })
    })
  }
  render() {

    if (this.state.loading) {
      return (
        <Loading />
      )
    } else {
      if (this.props.drawer) {
        return (
          <Forum
            name={this.state.name}
            address={this.props.address} />
        )
      }
      if (this.props.user) {

      }
      
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

export default connect(mapStateToProps)(ForumContainer);
