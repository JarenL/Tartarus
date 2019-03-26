import React, { Component } from 'react';
import { connect } from 'react-redux';
import ForumContract from '../../contracts/Forum.json';
import Forum from './Forum';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner.js';

class ForumContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract() {
    const contract = require('truffle-contract');
    const forum = contract(ForumContract);
    forum.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      forum.at(this.props.address).then(instance => {
        instance.name
          .call({
            from: accounts[0],
            gasPrice: 20000000000
          })
          .then(result => {
            this.setState({
              name: this.props.web3.utils.hexToAscii(result),
              loading: false
            });
          });
      });
    });
  }
  render() {
    if (this.state.loading) {
      return <LoadingIndicatorSpinner />;
    } else {
      return <Forum name={this.state.name} address={this.props.address} />;
    }
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3
  };
}

export default connect(mapStateToProps)(ForumContainer);
