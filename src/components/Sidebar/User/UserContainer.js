import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';
import UserList from './UserList';
import UserMessageButton from './UserMessageButton';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner';
import UserHeader from './UserHeader';

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

const authCategories = ['posts', 'comments', 'messages', 'saved'];

const categories = ['posts', 'comments'];

class UserContainer extends Component {
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
              creator: this.props.web3.utils.fromAscii(
                this.props.params.username
              )
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
    if (this.state.loading) {
      return <LoadingIndicatorSpinner />;
    } else {
      if (this.props.username !== this.props.params.username) {
        return (
          <Wrapper>
            <UserMessageButton />
            <UserHeader username={this.props.params.username} />
            <UserList
              path={this.props.url}
              username={this.props.params.username}
              categories={categories}
            />
          </Wrapper>
        );
      } else {
        return (
          <Wrapper>
            <UserHeader username={this.props.params.username} />
            <UserList
              path={this.props.url}
              username={this.props.params.username}
              categories={authCategories}
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
    username: state.user.username,
    tartarusAddress: state.tartarus.tartarusAddress
  };
}

export default connect(mapStateToProps)(UserContainer);
