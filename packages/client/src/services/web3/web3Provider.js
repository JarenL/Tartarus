import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getWeb3 from './getWeb3';
import { connect } from 'react-redux';
import {
  initializeWeb3,
  userLogout,
  userChangeAccount
} from '../../redux/actions/actions';
import LoadingIndicatorSpinner from '../../components/shared/LoadingIndicator/Spinner';

class Web3Provider extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      accounts: [],
      networkId: null,
      gettingWeb3: true
    };
    // this.interval = null;
    // this.networkInterval = null;
    // this.fetchAccounts = this.fetchAccounts.bind(this);
    this.fetchNetwork = this.fetchNetwork.bind(this);
    this.fetchAccounts = this.fetchAccounts.bind(this);
    this.initWeb3 = this.initWeb3.bind(this);
    this.handleNetworkChanged = this.handleNetworkChanged.bind(this);
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
  }

  componentWillMount() {
    // this.initWeb3();
    console.log(window.ethereum)
    console.log(!window.ethereum)

    this.fetchNetwork();
    this.fetchAccounts();
  }

  //  get web3
  // getnetwork
  //get accounts

  /**
   * Init web3, dispatch to store
   * @return {Object}
   */

  initWeb3 = async () => {
    console.log('init web3');
    const web3 = await getWeb3();
    // const web3 = null;

    console.log(web3);
    this.props.dispatch(initializeWeb3(web3));
    this.setState({
      gettingWeb3: false
    });
    this.fetchNetwork();
    this.fetchAccounts();
  };

  fetchNetwork = async () => {
    const ethereum = window.ethereum;
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log(chainId);
    this.handleNetworkChanged(chainId);

    ethereum.on('chainChanged', this.handleNetworkChanged);
  };

  handleNetworkChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    // window.location.reload();
    console.log('NETWORK CHANGE');
    if (_chainId !== this.state.networkId) {
      this.setState({
        networkId: _chainId
      });
    }
  }

  /**
   * Get the account. We wrap in try/catch because reading `web3.eth.accounts`
   * will throw if no account is selected.
   * @return {String}
   */

  fetchAccounts = async () => {
    const ethereum = window.ethereum;
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    this.handleAccountsChanged(accounts);

    ethereum.on('accountsChanged', this.handleAccountsChanged);
  };

  handleAccountsChanged(accounts) {
    console.log('ACCOUNT CHANGE');
    console.log(this.state.accounts);
    console.log(accounts);
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
      this.props.dispatch(userLogout());
      this.setState({
        accounts: []
      });
    }

    if (accounts[0] !== this.state.accounts[0]) {
      console.log('CHANE ACC');
      // this.props.dispatch(userChangeAccount(accounts[0]));
      this.setState({
        accounts: accounts
      });
      // this.props.dispatch(userChangeAccount(accounts[0]));
    }
  }

  render() {
    console.log('render');
    if (!window.ethereum) {
      return <this.props.web3UnavailableScreen />;
    } else {
      return <this.props.web3AvailableScreen />;
    }
  }
}

export default connect()(Web3Provider);
