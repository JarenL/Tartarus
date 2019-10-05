import React, { Component } from 'react';
import styled from 'styled-components/macro';
import UserList from './UserList';
import UserMessageButton from '../../Buttons/UserMessageButton';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner';
import UserHeader from './UserHeader';
import authCategories from './AuthCategories';
import categories from './Categories';
import UserWithdraw from './UserWithdraw';
import { withRouter } from 'react-router';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 240px;
  background-color: ${props => props.theme.foreground};
`;

class UserSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userHex: null,
      userBalance: 0
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    // if (this.props.user === this.props.username) {
    //   this.instantiateContract();
    // }
    this.instantiateContract();
  };

  instantiateContract() {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.users
          .call(this.props.web3.utils.fromAscii(this.props.user), {
            fromBlock: 0,
            toBlock: 'latest'
          })
          .then(user => {
            this.setState({
              userBalance: this.props.web3.utils.fromWei(
                user[3].toString(),
                'ether'
              ),
              userHex: user[0],
              loading: false
            });
          });
      });
    });
  }

  handleMessage = () => {
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      this.props.history.push('/message');
    }
  };

  handleWithdraw = () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    console.log('withdraw');
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus
        .at(this.props.tartarusAddress)
        .then(instance => {
          instance.userWithdraw
            .sendTransaction(
              this.props.web3.utils.fromAscii(this.props.username),
              accounts[0],
              {
                from: accounts[0],
                gasPrice: 20000000000
              }
            )
            .then(result => {
              this.setState({
                loading: false
              });
            })
            .catch(function(e) {
              console.log('error');
              this.setState({
                loading: false
              });
            });
        })
        .catch(err => {
          console.log('error');
        });
    });
  };

  render() {
    // if (this.state.loading) {
    //   return <LoadingIndicatorSpinner />;
    // } else {
      if (this.props.username !== this.props.user) {
        return (
          <Wrapper>
            {/* <UserMessageButton user={this.props.user} handleMessage={this.handleMessage} /> */}
            <UserHeader user={this.props.user} userHex={this.state.userHex} />
            <UserList
              path={this.props.url}
              user={this.props.user}
              categories={categories}
            />
          </Wrapper>
        );
      } else {
        return (
          <Wrapper>
            {/* <UserHeader
              user={this.props.user}
              userHex={this.props.web3.utils.fromAscii(this.props.user)}
            /> */}
            <UserWithdraw
              userBalance={this.state.userBalance}
              handleWithdraw={this.handleWithdraw}
            />
            <UserList
              path={this.props.url}
              user={this.props.user}
              categories={authCategories}
            />
          </Wrapper>
        );
      }
    }
  // }
}

export default withRouter(UserSidebar);
