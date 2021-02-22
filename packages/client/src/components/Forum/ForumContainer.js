import React, { Component } from 'react';
import { connect } from 'react-redux';
import TartarusContract from '../../contracts/Tartarus.json';
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
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    console.log(this.props)
    tartarus.at(this.props.tartarusAddress).then(instance => {
      instance.forums.call(this.props.forumName).then(forum => {
        console.log(forum);
        this.setState({
          name: this.props.web3.utils.hexToAscii(forum[0]),
          loading: false
        });
      });
    });
  }
  render() {
    if (this.state.loading) {
      return <LoadingIndicatorSpinner />;
    } else {
      return <Forum name={this.state.name} />;
    }
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    tartarusAddress: state.tartarus.tartarusAddress
  };
}

export default connect(mapStateToProps)(ForumContainer);
