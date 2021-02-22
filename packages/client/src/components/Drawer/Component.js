import React, { Component } from 'react';
import { setDrawerState } from '../../redux/actions/actions';
import Drawer from './Drawer';

class AppDrawer extends Component {
  handleDrawerToggle = () => {
    this.props.dispatch(setDrawerState());
  };

  render() {
    if (this.props.drawerState) {
      console.log('drawer open');
      return (
        <Drawer
          open={this.props.drawerState}
          position='left'
          onDismiss={() => this.handleDrawerToggle()}
          // backgroundColor='rgba(5, 29, 51, 0.9)'
          size='240px'
          username={this.props.username}
          userHex={this.props.web3.utils.fromAscii(this.props.username)}
          handleDrawerToggle={this.handleDrawerToggle}
        />
      );
    } else {
      return null;
    }
  }
}

export default AppDrawer;
