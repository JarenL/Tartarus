import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DrawerContainer from './components/Drawer/DrawerContainer';
import AppBarContainer from './components/AppBar/AppBarContainer';
import getWeb3 from './services/web3/getWeb3';
import TartarusContract from './contracts/Tartarus.json';
import { Route, Switch } from "react-router-dom";
import Loading from './components/Loading';
import { connect } from 'react-redux';
import FeedPage from './components/Views/Feed/FeedPage';
import ForumPage from './components/Views/Forum/ForumPage';
import PostPage from './components/Views/Post/PostPage';
import CommentPage from './components/Views/Comment/CommentPage'
import UserPage from './components/Views/User/UserPage';
import AboutPage from './components/Views/About/AboutPage';
import SearchPage from './components/Views/Search/Forum/ForumSearchPage'

import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './style/theme'

import {
  initializeWeb3,
  setCurrentUserAddress,
  setTartarusAddress
} from './redux/actions/actions'

// Styles
import './style/css/oswald.css'
import './style/css/open-sans.css'
import './style/css/pure-min.css'
import './style/css/App.css'

const styles = theme => ({
  main: {
    display: 'flex'
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    marginTop: 45,

    marginLeft: '0%',
    padding: theme.spacing.unit,
    minHeight: '100vh',
    minWidth: 0
  },
});

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      marginLeft: "0%",
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
    this.props.dispatch(setTartarusAddress("0x75c35c980c0d37ef46df04d31a140b65503c0eed"))
    tartarus.setProvider(this.props.web3.currentProvider)
    tartarus.at(this.props.tartarusAddress).then((instance) => {
      instance.authenticateUser({ from: this.props.accounts.currentOwnerAddress }).then((result) => {
        if (result !== "0x0000000000000000000000000000000000000000") {
          this.props.dispatch(setCurrentUserAddress(result))
        } else {
          console.log("user account not found")
        }
        this.setState({
          loading: false
        })
      })
    })
  }

  render() {
    const { classes } = this.props;
    if (this.state.loading) {
      return  <Loading />
    } else {
      return (
        <MuiThemeProvider theme={theme}>
        <div>
          <AppBarContainer/>
          <div className={classes.main}>
            <div>
              <DrawerContainer />
            </div>
            <div className={classes.content} style={{ marginLeft: this.props.drawerState.drawerState ? '15%': '0%'}}>
              <Switch>
                <Route exact path="/" component={FeedPage} />
                <Route path={"/forum/:forumAddress"} component={ForumPage} />
                <Route path={"/post/:postAddress"} component={PostPage} />
                <Route path={"/comment/:commentAddress"} component={CommentPage} />
                <Route path={"/user/:userAddress"} component={UserPage} />
                <Route path={"/about"} component={AboutPage} />
                <Route path={"/user"} component={UserPage} />
                <Route path={"/search"} component={SearchPage} />
              </Switch>
            </div>
          </div>
        </div>
        </MuiThemeProvider>
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
    drawerState: state.drawerState,
    currentForum: state.forum.currentForum,
    currentForumAddress: state.forum.currentForumAddress
  };
}

export default connect(mapStateToProps, null, null, {
  pure: false
})(withStyles(styles, {withTheme: true})(App));