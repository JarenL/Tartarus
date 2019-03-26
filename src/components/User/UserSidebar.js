import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';
import UserSidebarList from './UserSidebarList';
import UserMessageButton from './UserMessageButton';
import UserContract from '../../contracts/User.json';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';

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

class UserSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  instantiateContract() {
    const contract = require('truffle-contract');
    const user = contract(UserContract);
    user.setProvider(this.props.web3.currentProvider);
    user.at(this.props.user.userAddress).then(userInstance => {
      userInstance.username.call().then(username => {
        this.setState({
          username: this.props.web3.utils.hexToAscii(username),
          loading: false
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <LoadingIndicatorSpinner />;
    } else {
      if (this.props.params.userAddress !== this.props.user.userAddress) {
        return (
          <Wrapper>
            <UserMessageButton />
            <UserSidebarList
              path={this.props.url}
              userAddress={this.props.params.userAddress}
              username={this.state.username}
            />
          </Wrapper>
        );
      } else {
        return (
          <Wrapper>
            <UserSidebarList
              path={this.props.url}
              userAddress={this.props.params.userAddress}
              username={this.state.username}
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
    user: state.user
  };
}

export default connect(mapStateToProps)(UserSidebar);
