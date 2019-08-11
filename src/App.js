import React, { Component } from 'react';
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

// const tartarusAddress = '0x4c905e8c4533cb6928abaa159ca7b45b22f4d086';
// const tartarusAddress = '0x3ca7832b2edd307b075903e2aac2ff04308ad001';
const tartarusAddress = '0x48fa651daaa05c78235a026fbe4ad602ebd34e0c';

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

  getTxCosts = async () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    let accounts = await this.props.web3.eth.getAccounts();
    let createPostCost = await instance.createPostCost.call();
    let createPostGas = await instance.createPost.estimateGas(
      this.props.web3.utils.fromAscii(this.props.username),
      this.props.web3.utils.fromAscii(this.props.forumName),
      this.props.web3.utils.fromAscii(this.props.username),
      {
        from: accounts[0],
        gasPrice: 20000000000,
        value: createPostCost
      }
    );
    console.log('create post gas - ' + createPostGas.toString());
    let gasPrice = await this.props.web3.eth.getGasPrice();
    let test = createPostGas * gasPrice;
    console.log(
      'create post eth cost - ' +
        this.props.web3.utils.fromWei(test.toString(), 'ether')
    );
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
