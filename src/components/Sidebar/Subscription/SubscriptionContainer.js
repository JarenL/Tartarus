import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';
import { Divider } from '@material-ui/core';
import SubscriptionHeader from './SubscriptionHeader.js';
import SubscriptionList from './SubscriptionList.js';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

class SubscriptionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCategories: true
    };
  }

  toggleShowCategories = () => {
    this.setState({ showCategories: !this.state.showCategories });
  };

  render() {
    return (
      <Wrapper>
        <SubscriptionHeader
          showCategories={this.state.showCategories}
          toggleShowCategories={this.toggleShowCategories}
        />
        {this.state.showCategories && (
          <SubscriptionList
            userAddress={this.props.userAddress}
            userSettings={this.props.userSettings}
          />
        )}
      </Wrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    userSettings: state.user.userSettings,
    userAddress: state.user.userAddress
  };
}

export default connect(mapStateToProps)(SubscriptionContainer);
