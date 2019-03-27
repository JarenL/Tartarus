import React, { Component } from 'react';
import { connect } from 'react-redux';
import ForumContract from '../../../contracts/Forum.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner.js';
import SidebarCategoryListItem from './Item.js';
import Loading from '../../shared/LoadingIndicator/Loading.js';
// import Loading from '../../Loading.js';

class ForumContainer extends Component {
  render() {
    return (
      <SidebarCategoryListItem
        name={this.props.forumName}
        address={this.props.forumAddress}
      />
    );
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
