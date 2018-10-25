import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ForumListContainer from './Containers/ForumListContainer';
import AppBarContainer from './Containers/AppBarContainer';
import getWeb3 from './utils/getWeb3';
import TartarusContract from '../build/contracts/Tartarus.json';
import { connect } from 'react-redux'
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
    padding: theme.spacing.unit * 3,
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
      // this.props.dispatch(setCurrentOwnerAddress(accounts[0]))
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
      <div>
        <AppBarContainer />
        <div className={classes.main}>
          <div>
            <ForumListContainer currentUserAccount={this.state.currentUserAccount} />
          </div>
          <div className={classes.content}>
            <p>{this.props.accounts.currentOwnerAddress}</p>
            <p>{this.props.accounts.currentUserAddress}</p>
          </div>
        </div>
      </div>
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
    accounts: state.accounts
  };
}

export default connect(mapStateToProps)(withStyles(styles)(App));
