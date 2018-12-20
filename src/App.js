import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DrawerContainer from './Components/Drawer/DrawerContainer';
import AppBarContainer from './Components/AppBar/AppBarContainer';
import getWeb3 from './utils/getWeb3';
import TartarusContract from '../build/contracts/Tartarus.json';
import { Route, Switch } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import FrontPage from './Components/FrontPage';
import ForumPage from './Components/Forum/ForumPage';
import PostPage from './Components/Post/PostPage';
import UserPage from './Components/User/UserPage';


import {
  initializeWeb3,
  setCurrentUserAddress,
  setTartarusAddress
} from './actions/actions'

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
    backgroundColor: theme.palette.background.default,
    // backgroundColor: 'red',
    marginTop: 45,
    marginLeft: '15%',
    padding: theme.spacing.unit,
    minHeight: '100vh',
    minWidth: 0, // So the Typography noWrap works
  },
});

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tartarusInstance: null,
      loading: true
    }
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    getWeb3
      .then(results => {
        this.props.dispatch(initializeWeb3(results.web3))
        this.instantiateContract();
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  componentDidUpdate(newProps) {
    if (newProps.accounts.currentOwnerAddress !== "0") {
      if (newProps.accounts.currentOwnerAddress !== this.props.accounts.currentOwnerAddress) {
        window.location.reload();
      }
    }
  }

  instantiateContract = () => {
    this.props.dispatch(setCurrentUserAddress(0))
    const contract = require('truffle-contract')
    const tartarus = contract(TartarusContract)
    this.props.dispatch(setTartarusAddress("0x10263ac5725e77dd9c2f2e4d04388311abba7fff"))
    tartarus.setProvider(this.props.web3.currentProvider)
    tartarus.at(this.props.tartarusAddress).then((instance) => {
      instance.authenticateUser({from : this.props.accounts.currentOwnerAddress}).then((result) => {
        console.log(result)
        if (result !== "0x0000000000000000000000000000000000000000") {
          this.props.dispatch(setCurrentUserAddress(result))
        } else {
          console.log("user account not found")
        }
        this.setState({ loading: false })
      })
    })
  }

  render() {
    const { classes } = this.props;
    if (this.state.loading) {
      return (
        <CircularProgress />
      )
    } else {
      return (
        <div>
          <AppBarContainer />
          <div className={classes.main}>
            <div>
              <DrawerContainer />
            </div>
            <div className={classes.content}>
              <Switch>
                <Route exact path="/" component={FrontPage} />
                <Route path={"/forum/:forumAddress"} component={ForumPage} />
                <Route path={"/post/:postAddress"} component={PostPage} />
                <Route path={"/user/:userAddress"} component={UserPage} />
              </Switch>
            </div>
          </div>
        </div>
      )
    }

  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    web3: state.web3,
    tartarusAddress: state.tartarus.tartarusAddress,
    accounts: state.accounts,
    currentForum: state.forum.currentForum,
    currentForumAddress: state.forum.currentForumAddress
  };
}

export default connect(mapStateToProps, null, null, {
  pure: false
})(withStyles(styles)(App));