import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  drawerPaper: {
    position: 'ablsolute',
    marginTop: 65,
    width: '15%'
  }
});

class UnauthDrawer extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}>
          <Divider />
          <p>you need an account</p>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(UnauthDrawer);