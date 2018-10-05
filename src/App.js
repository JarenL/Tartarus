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
  root: {
    display: 'flex',
    flex: 1
  },
  content: {
    marginTop: 65,
    marginLeft: '15%',

    flex: 1, 
    backgroundColor: 'red',
    minHeight: '100vh', // So the Typography noWrap works
  }
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
          <div className={classes.root}>
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
