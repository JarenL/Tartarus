import React, { Component } from 'react'
import PostListContainer from './Containers/PostListContainer';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from './Components/Drawer';
import AppBar from './Components/AppBar';

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const styles = theme => ({
  main: {
    display: 'flex'
  },
  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    backgroundColor: 'red',
    marginTop: 45,
    marginLeft: '15%',
    padding: theme.spacing.unit * 3,
    minHeight: '100vh',
    minWidth: 0, // So the Typography noWrap works
  },
});

class App extends Component {
  state = { 
    loading: true, 
    currentForum: "home",
    drizzleState: null 
  };

  componentDidMount() {
    const { drizzle } = this.props;

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }
    });
  }

  compomentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    // if (this.state.loading) {
    //   return "Loading Drizzle...";
    // } else {
      const { classes } = this.props;
      return (
        <div>
          <div>
            <AppBar/>
          </div>
          <div className={classes.main}>
            <div>
              <Drawer/>
            </div>
            <div className={classes.content}>
              <PostListContainer/>
            </div>
          </div>
        </div>
      )
    // }
  }
}

  App.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(App);
