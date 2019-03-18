import React, { Component } from 'react';
import { connect } from 'react-redux';
import ForumContract from '../../../contracts/Forum.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner.js';
import SidebarCategoryListItem from './Item.js';
import Loading from '../../Loading.js';

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
    console.log('forum');
    console.log(this.props);
    const contract = require('truffle-contract');
    const forum = contract(ForumContract);
    console.log(this.props.forumAddress);
    forum.setProvider(this.props.web3.currentProvider);
    forum.at(this.props.forumAddress).then(instance => {
      instance.name.call().then(result => {
        console.log(result);
        this.setState({
          name: result,
          loading: false
        });
      });
    });
  }
  render() {
    if (this.state.loading) {
      return <Loading size={25} />;
    } else {
      return (
        <SidebarCategoryListItem
          name={this.state.name}
          address={this.props.forumAddress}
        />
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    accounts: state.accounts,
    tartarusAddress: state.tartarus.tartarusAddress
  };
}

export default connect(mapStateToProps)(ForumContainer);
