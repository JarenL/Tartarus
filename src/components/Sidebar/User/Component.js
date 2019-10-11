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
import { updateUserWatched } from '../../../redux/actions/actions';

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
      userBalance: 0,
      watched: false,
      showWatch: false
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
            console.log(user);
            if (this.props.username !== null) {
              this.checkWatched();
            }
            this.setState({
              userBalance: this.props.web3.utils.fromWei(
                user[3].toString(),
                'ether'
              ),
              userHex: user[0],
              showWatch: this.props.username !== this.props.user,
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

  checkWatched = () => {
    const index = this.props.userSettings[
      this.props.username
    ].watched.users.findIndex(
      user => this.props.web3.utils.toUtf8(user.userId) === this.props.user
    );
    if (index === -1) {
      console.log('no watch');
      this.setState({
        watched: false
      });
    } else {
      this.setState({
        watched: true
      });
    }
  };

  handleWatch = props => {
    console.log('watch');
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      let newWatchedUsersArray = this.props.userSettings[this.props.username]
        .watched;
      newWatchedUsersArray.users.push({
        userId: props,
        event: 'UserWatched'
      });
      let payload = {
        username: this.props.username,
        watched: newWatchedUsersArray
      };
      this.props.dispatch(updateUserWatched(payload));
      this.checkWatched();
    }
  };

  handleUnwatch = props => {
    console.log('unwatch');
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      let newWatched = this.props.userSettings[this.props.username].watched;
      let newWatchedUsersArray = newWatched.users.slice();
      for (var i = 0; i < newWatchedUsersArray.length; i++) {
        if (newWatchedUsersArray[i].userId === props) {
          newWatchedUsersArray.splice(i, 1);
        }
      }
      newWatched.users = newWatchedUsersArray;
      let payload = {
        username: this.props.username,
        watched: newWatched
      };
      this.props.dispatch(updateUserWatched(payload));
      this.checkWatched();
    }
  };

  render() {
    if (this.state.loading) {
      return <LoadingIndicatorSpinner />;
    } else {
      console.log(this.props);
      if (this.props.username !== this.props.user) {
        return (
          <Wrapper>
            <UserMessageButton user={this.props.user} handleMessage={this.handleMessage} />
            <UserHeader
              user={this.props.user}
              userHex={this.state.userHex}
              showWatch={true}
              watched={this.state.watched}
              handleWatch={this.handleWatch}
              handleUnwatch={this.handleUnwatch}
            />
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
            <UserHeader
              user={this.props.user}
              showWatch={false}
              handleWatch={this.handleWatch}
              handleUnwatch={this.handleUnwatch}
              userHex={this.state.userHex}
            />

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
  }
}

export default withRouter(UserSidebar);
