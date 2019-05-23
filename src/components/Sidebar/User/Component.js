import React, { Component } from 'react';
import styled from 'styled-components/macro';
import UserList from './UserList';
import UserMessageButton from './UserMessageButton';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner';
import UserHeader from './UserHeader';
import authCategories from './AuthCategories';
import categories from './ModeratorCategories';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

class UserSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      posts: [],
      comments: []
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  instantiateContract() {
    console.log(this.props);
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance
          .PostCreated(
            {
              creator: this.props.web3.utils.fromAscii(this.props.user)
            },
            {
              fromBlock: 0,
              toBlock: 'latest'
            }
          )
          .get((error, posts) => {
            this.setState({
              posts: posts,
              loading: false
            });
            console.log(posts);
          });
      });
    });
  }

  render() {
    console.log(this.props);
    if (this.state.loading) {
      return <LoadingIndicatorSpinner />;
    } else {
      if (this.props.username !== this.props.user) {
        return (
          <Wrapper>
            <UserMessageButton />
            <UserHeader user={this.props.user} />
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
            <UserHeader user={this.props.user} />
            <UserList
              path={this.props.url}
              user={this.props.user}
              categories={authCategories}
            />
          </Wrapper>
        );
      }
    }
  }
}

export default UserSidebar;
