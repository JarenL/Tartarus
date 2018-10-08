import React, { Component } from 'react'
import PostListContainer from './Containers/PostListContainer';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ForumListContainer from './Containers/ForumListContainer';
import AppBar from './Components/AppBar';
import getWeb3 from './utils/getWeb3';
import TartarusContract from '../build/contracts/Tartarus.json';
import AddUserButton from './Components/AddUserButton';

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
      // matchFactoryAddress: props.currentAddress,
      userContractAddress: null,
      currentAddress: null,
      tartarusInstance: null,
      web3: null
    }

    this.instantiateContract = this.instantiateContract.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);
    this.createUser = this.createUser.bind(this);
    this.currentAccountListener = this.currentAccountListener.bind(this);
  }

  componentDidMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
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
    tartarus.setProvider(this.state.web3.currentProvider)
    this.state.web3.eth.getAccounts((error, accounts) => {
      tartarus.deployed().then((instance) => {
        this.setState({
          currentAddress: accounts[0],
          tartarusInstance: instance
        })
        this.authenticateUser();
      })
    })
  }

  currentAccountListener = () => {
    this.state.web3.currentProvider.publicConfigStore.on('update', (result) => {
      console.log("account change")
      this.setState({
        currentAddress: result.selectedAddress
      })
      this.authenticateUser();
    });
  }

  authenticateUser = () => {
    this.setState({
      userContractAddress: "No user account found"
    })
    this.state.web3.eth.getAccounts((error, accounts) => {
      const userCreatedEvent = this.state.tartarusInstance.UserCreated({ ownerAddress: accounts[0] }, {fromBlock:0, toBlock:'latest'});
      userCreatedEvent.watch((error, result) => {
        if (!error) {
          if (result.event === "UserCreated") {
            console.log(result)
            this.setState({
              currentAddress: accounts[0],
              userContractAddress: result.args.userAddress
            })
          }
        } else {
          console.log("error")
        }
      })
    })
  }

  createUser = () => {
    console.log("hello");
    this.state.web3.eth.getAccounts((error, accounts) => {
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
            <p>{this.state.currentAddress}</p>
            <p>{this.state.userContractAddress}</p>
          </div>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
