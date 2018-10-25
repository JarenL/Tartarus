import React, { Component } from 'react'
import { connect } from 'react-redux'
import AuthAppBar from '../Components/AppBar/AuthAppBar';
import UnauthAppBar from '../Components/AppBar/UnauthAppBar';
import TartarusContract from '../../build/contracts/Tartarus.json';

class AppBarContainer extends Component {
    createUser = () => {
        const contract = require('truffle-contract')
        const tartarus = contract(TartarusContract)
        tartarus.setProvider(this.props.web3.currentProvider)
        console.log(this.props)
        this.props.web3.eth.getAccounts((error, accounts) => {
            tartarus.at(this.props.tartarusAddress).then((instance) => {
                instance.createUser(
                    { from: accounts[0], gasPrice: 20000000000 }
                )
            })
        })
    }
    render() {
        if (this.props.accounts.currentUserAddress === 0) {
            return (
                <div>
                    <UnauthAppBar createUser={this.createUser}/>
                </div>
            )

        } else {
            return (
                <div>
                    <AuthAppBar/>
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        web3: state.web3,
        accounts: state.accounts,
        tartarusAddress: state.tartarus.tartarusAddress,
    };
}

export default connect(mapStateToProps)(AppBarContainer);
