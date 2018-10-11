import React, { Component } from 'react'
import PostListContainer from './Containers/PostListContainer';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ForumListContainer from './Containers/ForumListContainer';
import AppBar from './Components/AppBar';
import getWeb3 from './utils/getWeb3';
import TartarusContract from '../build/contracts/Tartarus.json';
import AddUserButton from './Components/AddUserButton';
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
    this.createUser = this.createUser.bind(this);
    this.currentAccountListener = this.currentAccountListener.bind(this);
  }

  componentDidMount() {
    getWeb3
    .then(results => {
      this.props.dispatch(initializeWeb3(results.web3))
      this.currentAccountListener();
      this.instantiateContract();
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const tartarus = contract(TartarusContract)
    const tartarusAddress = "0x8f0483125fcb9aaaefa9209d8e9d7b9c8b9fb90f";
    tartarus.setProvider(this.props.web3.currentProvider)
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(tartarusAddress).then((instance) => {
        this.setState({
          tartarusInstance: instance
        })
        this.props.dispatch(setTartarusAddress(tartarusAddress))
        this.props.dispatch(setCurrentOwnerAddress(accounts[0]))
        this.authenticateUser();
      })
    })
  }

  currentAccountListener = () => {
    this.props.web3.currentProvider.publicConfigStore.on('update', (result) => {
      console.log("account change")
      this.props.dispatch(setCurrentOwnerAddress(result.selectedAddress))
      this.authenticateUser();
    });
  }

  authenticateUser = () => {
    this.setState({
      userContractAddress: "No user account found"
    })
    this.props.web3.eth.getAccounts((error, accounts) => {
      const userCreatedEvent = this.state.tartarusInstance.UserCreated({ ownerAddress: accounts[0] }, {fromBlock:0, toBlock:'latest'});
      userCreatedEvent.watch((error, result) => {
        if (!error) {
          if (result.event === "UserCreated") {
            console.log(result)
            this.props.dispatch(setCurrentOwnerAddress(accounts[0]))
            this.props.dispatch(setCurrentUserAddress(result.args.userAddress))
          }
        } else {
          console.log("error")
        }
      })
    })
  }

  createUser = () => {
    this.props.web3.eth.getAccounts((error, accounts) => {
      this.state.tartarusInstance.createUser(
        { from: accounts[0], gasPrice: 20000000000 }
      )
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar />
        <div className={classes.main}>
          <div>
            <ForumListContainer currentUserAccount={this.state.currentUserAccount}/>
          </div>
          <div className={classes.content} onClick={this.createUser}>
            <AddUserButton onClick={this.createUser}/>
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
    tartarusAddress: state.tartarusAddress,
    tartarusInstance: state.tartarusInstance,
    accounts: state.accounts
  };
}

export default connect(mapStateToProps)(withStyles(styles)(App));
