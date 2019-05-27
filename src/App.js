import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import getWeb3 from './services/web3/getWeb3';
import { connect } from 'react-redux';
import GlobalStyle from './globalStyle';
import { HashRouter, Route, Switch } from 'react-router-dom';
import HeaderContainer from './components/Header/Container';
import Home from './components/Home';
import LoginFormContainer from './components/LoginForm/Container';
import SignupFormContainer from './components/SignupForm/Container';
import CreateForumFormContainer from './components/CreateForumForm/Container';
import {
  initializeWeb3,
  setTartarusAddress,
  updateUserPermissions
} from './redux/actions/actions';
import LoadingIndicatorSpinner from './components/shared/LoadingIndicator/Spinner';
import TartarusContract from './contracts/Tartarus.json';

const tartarusAddress = '0x0c829f8c1f831fd3923ccfd87b948ffa6af26e16';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    getWeb3
      .then(results => {
        this.props.dispatch(initializeWeb3(results.web3));
        this.props.dispatch(setTartarusAddress(tartarusAddress));
        this.checkAdmin();
      })
      .catch(() => {
        console.log('Error finding web3.');
      });
  }

  checkAdmin = () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    tartarus.at(this.props.tartarusAddress).then(instance => {
      instance.getAdmin
        .call(this.props.web3.utils.fromAscii(this.props.username))
        .then(isAdmin => {
          console.log(isAdmin);
          this.props.dispatch(
            updateUserPermissions({ type: 'admin', permissions: isAdmin })
          );
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
                <Route
                  path='/createforum'
                  component={CreateForumFormContainer}
                />
                <Route path='/' component={Home} />
              </Switch>
            </>
          </HashRouter>
        </ThemeProvider>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    dark: state.theme.dark,
    username: state.user.username,
    tartarusAddress: state.tartarus.tartarusAddress
  };
}

const AppContainer = connect(mapStateToProps)(App);

export default AppContainer;
