import React from 'react';
import styled from 'styled-components/macro';
import TartarusContract from '../../../../../contracts/Tartarus.json.js';
import LoadingIndicatorSpinner from '../../../../shared/LoadingIndicator/Spinner';
import Chart from './Chart';
import Balance from './Balance';

class Wages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admins: [],
      adminBalance: 0,
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = async () => {
    await Promise.all(this.props.admins.map(admin => this.getAdmin(admin)));
    this.instantiateContract();
  };

  instantiateContract = async () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    let admin = await instance.getAdmin.call(
      this.props.web3.utils.fromAscii(this.props.username)
    );
    let tartarusBalance = await instance.adminBalance.call();
    let adminBalance =
      (admin[7].toNumber() / 100) * (tartarusBalance - admin[8].toNumber());
    this.setState({
      adminBalance: this.props.web3.utils.fromWei(
        adminBalance.toString(),
        'ether'
      ),
      loading: false
    });
  };

  getAdmin = async props => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    let admin = await instance.getAdmin.call(props);
    let adminList = this.state.admins;
    adminList.push({
      name: this.props.web3.utils.toAscii(props),
      value: admin[7].c[0]
    });
    this.setState({
      admins: adminList
    });
  };

  handleWithdraw = async () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    console.log('withdraw');
    tartarus.setProvider(this.props.web3.currentProvider);
    let accounts = await this.props.web3.eth.getAccounts();
    let instance = await tartarus.at(this.props.tartarusAddress);
    instance.adminWithdraw
      .sendTransaction(this.props.web3.utils.fromAscii(this.props.username), {
        from: accounts[0],
        gasPrice: 20000000000
      })
      .then(result => {
        this.setState({
          loading: false
        });
      })
      .catch(error => {
        console.log('error');
        this.setState({
          loading: false
        });
      });
  };

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.admins || this.state.admins.length === 0) {
      return null;
    } else {
      console.log(this.props.username);
      return (
        <>
          <Chart admins={this.state.admins} />
          <Balance
            adminBalance={this.state.adminBalance}
            username={this.props.username}
            handleWithdraw={this.handleWithdraw}
          />
        </>
      );
    }
  }
}

export default Wages;
