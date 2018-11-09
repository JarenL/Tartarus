import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DrawerContainer from './Containers/DrawerContainer';
import AppBarContainer from './Containers/AppBarContainer';
import PostListContainer from './Containers/PostListContainer'
import Header from './Components/Header'
import getWeb3 from './utils/getWeb3';
import Divider from '@material-ui/core/Divider';
import TartarusContract from '../build/contracts/Tartarus.json';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import { connect } from 'react-redux';
import FrontPage from './Components/FrontPage';
import ForumPage from './Components/ForumPage';
import PostPage from './Components/PostPage';
import UserPage from './Components/UserPage';


import {
  initializeWeb3,
  setCurrentOwnerAddress,
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
      tartarusInstance: null
    }

    this.instantiateContract = this.instantiateContract.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);
    this.currentAccountListener = this.currentAccountListener.bind(this);
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

  instantiateContract = () => {
    const contract = require('truffle-contract')
    const tartarus = contract(TartarusContract)
    this.props.dispatch(setTartarusAddress("0xf12b5dd4ead5f743c6baa640b0216200e89b60da"))
    tartarus.setProvider(this.props.web3.currentProvider)
    tartarus.at(this.props.tartarusAddress).then((instance) => {
      this.setState({
        tartarusInstance: instance
      })
      this.authenticateUser();
      this.currentAccountListener();
    })
  }

  currentAccountListener = () => {
    this.props.web3.currentProvider.publicConfigStore.on('update', (result) => {
      console.log("account change")
      this.authenticateUser();
    });
  }

  authenticateUser = () => {
    this.props.web3.eth.getAccounts((error, accounts) => {
      this.props.dispatch(setCurrentOwnerAddress(accounts[0]))
      this.props.dispatch(setCurrentUserAddress(0))
      const userCreatedEvent = this.state.tartarusInstance.UserCreated({ ownerAddress: accounts[0] }, { fromBlock: 0, toBlock: 'latest' });
      userCreatedEvent.watch((error, result) => {
        if (!error) {
          this.props.dispatch(setCurrentUserAddress(result.args.userAddress))
        } else {
          console.log("authentication event error")
        }
      })
    })
  }

  render() {
    const { classes } = this.props;
      return (
        <BrowserRouter>
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
        </BrowserRouter>
      )
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
  pure: false})(withStyles(styles)(App));