import React, { Component } from 'react'
import { connect } from 'react-redux'
import AuthDrawer from './Authenticated/AuthDrawer';
import UnauthDrawer from './Unauthenticated/UnauthDrawer';

class DrawerContainer extends Component {
  render() {
    if (this.props.drawerState.drawerState) {
      if (this.props.accounts.currentUserAddress === "0" || !this.props.accounts.currentUserAddress || this.props.accounts.currentUserAddress === undefined) {
        return (
          <div>
            <UnauthDrawer />
          </div>
        )
      } else {
        return (
          <div>
            <AuthDrawer />
          </div>
        )
      }
    } else {
      return null
    }

  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    drawerState: state.drawerState
  };
}

export default connect(mapStateToProps)(DrawerContainer);


