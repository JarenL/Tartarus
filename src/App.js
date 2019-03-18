import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import getWeb3 from './services/web3/getWeb3';
import TartarusContract from './contracts/Tartarus.json';
import { connect } from 'react-redux';
import GlobalStyle from './globalStyle';
import { HashRouter, Route, Switch } from 'react-router-dom';
import HeaderContainer from './components/Header/Component';
import Home from './components/Home';
import LoginFormContainer from './components/LoginForm/Container';
import SignupFormContainer from './components/SignupForm/Container';

// import { MuiThemeProvider } from '@material-ui/core/styles';
// import theme from './style/theme'

import {
  initializeWeb3,
  setCurrentUserAddress,
  setTartarusAddress,
  initializeUserSettings
} from './redux/actions/actions';
import LoadingIndicatorSpinner from './components/shared/LoadingIndicator/Spinner';

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
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marginLeft: '0%',
      tartarusInstance: null,
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    getWeb3
      .then(results => {
        this.props.dispatch(initializeWeb3(results.web3));
        this.instantiateContract();
      })
      .catch(() => {
        console.log('Error finding web3.');
      });
  }

  componentDidUpdate(newProps) {
    if (newProps.accounts.currentOwnerAddress !== '0') {
      if (
        newProps.accounts.currentOwnerAddress !==
        this.props.accounts.currentOwnerAddress
      ) {
        window.location.reload();
      }
    }
  }

  instantiateContract = () => {
    this.props.dispatch(setCurrentUserAddress(0));
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    this.props.dispatch(
      setTartarusAddress('0xAfB1a69F3a39d57547867E65a8b14bdF1c7a760B')
    );
    tartarus.setProvider(this.props.web3.currentProvider);
    tartarus.at(this.props.tartarusAddress).then(instance => {
      instance
        .authenticateUser({ from: this.props.accounts.currentOwnerAddress })
        .then(result => {
          console.log(result);
          // if (result !== '0x0000000000000000000000000000000000000000') {
          //   this.props.dispatch(setCurrentUserAddress(result));
          //   this.props.dispatch(initializeUserSettings(result));
          // } else {
          //   console.log('user account not found');
          // }
          this.setState({
            loading: false
          });
        });
    });
  };

  render() {
    if (this.state.loading) {
      return <LoadingIndicatorSpinner />;
    } else {
      return (
        <ThemeProvider theme={theme(this.props.dark)}>
          <HashRouter>
            <>
              <GlobalStyle />
              <Route component={HeaderContainer} />
              {/* <Route component={ErrorNotificationContainer} /> */}
              <Switch>
                <Route path='/login' component={LoginFormContainer} />
                <Route path='/signup' component={SignupFormContainer} />
                {/* <Route path='/createpost' component={CreatePostFormContainer} /> */}
                <Route path='/' component={Home} />
                {/* <Route path={'/forum/:forumAddress'} component={ForumPage} /> */}
                {/* <Route path={'/post/:postAddress'} component={PostPage} />
                <Route
                  path={'/comment/:commentAddress'}
                  component={CommentPage}
                />
                <Route path={'/user/:userAddress'} component={UserPage} />
                <Route path={'/about'} component={AboutPage} />
                <Route path={'/search'} component={SearchPage} /> */}
              </Switch>
            </>
          </HashRouter>
        </ThemeProvider>
      );
    }
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    web3: state.web3,
    dark: state.theme.dark,
    tartarusAddress: state.tartarus.tartarusAddress,
    accounts: state.accounts,
    drawerState: state.drawerState,
    currentForum: state.forum.currentForum,
    currentForumAddress: state.forum.currentForumAddress,
    currentUserAddress: state.accounts.currentUserAddress
  };
}

const AppContainer = connect(mapStateToProps)(App);

export default AppContainer;
