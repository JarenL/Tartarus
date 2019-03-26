import React, { Component } from 'react';
import Button from '../../shared/Button';
import styled from 'styled-components/macro';
import { connect } from 'react-redux';
import {
  // updateForumSubscriptions,
  updateUserSubscriptions
} from '../../../redux/actions/actions';

const UnsubscribeButton = styled(Button)`
  border-radius: 2px 2px 0 0;
  padding: 16px;
  text-decoration: none;
  text-align: center;
`;

const unsubscribeHandler = props => {
  let newSubscriptionsArray = props.userSettings[
    props.userAddress
  ].subscriptions.slice();
  for (var i = 0; i < newSubscriptionsArray.length; i++) {
    if (newSubscriptionsArray[i].address === props.forumContext) {
      newSubscriptionsArray.splice(i, 1);
    }
  }
  let payload = {
    user: props.userAddress,
    subscriptions: newSubscriptionsArray
  };
  // this.props.dispatch(updateForumSubscriptions(newSubscriptionsArray))
  props.dispatch(updateUserSubscriptions(payload));
};

const SidebarUnsubscribeButton = props => (
  <UnsubscribeButton onClick={() => unsubscribeHandler(props)}>
    Unsubscrbe
  </UnsubscribeButton>
);

function mapStateToProps(state) {
  return {
    userSettings: state.user.userSettings,
    userAddress: state.user.userAddress
  };
}

export default connect(mapStateToProps)(SidebarUnsubscribeButton);
