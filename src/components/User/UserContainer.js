import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';
import UserList from './UserList';
import UserMessageButton from './UserMessageButton';
import UserContract from '../../contracts/User.json';
import TartarusContract from '../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';
import UserHeader from './UserHeader';
import { Divider } from '@material-ui/core';

const Wrapper = styled.aside`
  display: flex;
  flex-direction: column;
  flex-basis: 240px;
  margin-left: 24px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 2px;
  background-color: ${props => props.theme.foreground};

  @media (max-width: 768px) {
    display: none;
  }
`;

class UserContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userAddress: null,
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  instantiateContract() {
    console.log(this.props);
    const contract = require('truffle-contract');
    const user = contract(UserContract);
    const tartarus = contract(TartarusContract);
    user.setProvider(this.props.web3.currentProvider);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.users
          .call(this.props.user.username, {
            from: accounts[0],
            gasPrice: 20000000000
          })
          .then(userAddress => {
            console.log(userAddress);
            this.setState({
              userAddress: userAddress,
              loading: false
            });
          });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <LoadingIndicatorSpinner />;
    } else {
      if (this.props.user.userAddress !== this.state.userAddress) {
        return (
          <Wrapper>
            <UserMessageButton />
            <UserHeader
              userAddress={this.state.userAddress}
              username={this.props.params.username}
            />
            <UserList
              path={this.props.url}
              userAddress={this.state.userAddress}
              username={this.props.params.username}
            />
          </Wrapper>
        );
      } else {
        return (
          <Wrapper>
            <UserHeader
              userAddress={this.state.userAddress}
              username={this.props.params.username}
            />
            <Divider />
            <UserList
              path={this.props.url}
              userAddress={this.state.userAddress}
              username={this.props.params.username}
            />
          </Wrapper>
        );
      }
    }
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    user: state.user,
    tartarusAddress: state.tartarus.tartarusAddress
  };
}

export default connect(mapStateToProps)(UserContainer);
