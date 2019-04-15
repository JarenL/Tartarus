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
import { initializeWeb3, setTartarusAddress } from './redux/actions/actions';
import LoadingIndicatorSpinner from './components/shared/LoadingIndicator/Spinner';

const tartarusAddress = '0x835cc6cf17477eb875b2cfb2238d4e7f235b5927';

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
        this.props.web3.eth.getAccounts((error, accounts) => {
          this.setState({
            loading: false
          });
        });
      })
      .catch(() => {
        console.log('Error finding web3.');
      });
  }

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
    tartarusAddress: state.tartarus.tartarusAddress
  };
}

const AppContainer = connect(mapStateToProps)(App);

export default AppContainer;
