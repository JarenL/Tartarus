import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import styled from 'styled-components/macro';
import getWeb3 from './services/web3/getWeb3';
import { connect } from 'react-redux';
import GlobalStyle from './globalStyle';
import { HashRouter, Route, Switch } from 'react-router-dom';
import HeaderContainer from './components/Header/Container';
import Home from './components/Home';
import LoginFormContainer from './components/LoginForm/Container';
import SignupFormContainer from './components/SignupForm/Container';
import {
  initializeWeb3,
  setTartarusAddress,
  updateUserPermissions,
  updateUserNotifications
} from './redux/actions/actions';
import LoadingIndicatorSpinner from './components/shared/LoadingIndicator/Spinner';
import TartarusContract from './contracts/Tartarus.json';
import Empty from './components/shared/Empty';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.minimal.css';

// const tartarusAddress = '0x4c905e8c4533cb6928abaa159ca7b45b22f4d086';
// const tartarusAddress = '0x3ca7832b2edd307b075903e2aac2ff04308ad001';
const tartarusAddress = '0xB6111442C7C0eB92F0fDFee597A5f2c581e84cb7';

const passiveNotificationEvents = [
  'AdminCreated',
  'AdminUpdated',
  'AdminRemoved',
  'AdminPaid',
  'AdminBan',
  'AdminUnban',
  'CommentCreated',
  'CommentRemoved',
  'ForumCreated',
  'ForumLocked',
  'ForumUpdated',
  'ModeratorBan',
  'ModeratorUnban',
  'ModeratorCreated',
  'ModeratorPaid',
  'ModeratorRemoved',
  'ModeratorUpdated',
  'PostCreated',
  'PostRemoved',
  'PostLocked',
  'UserCreated',
  'UserUpdated',
  'UserWithdraw',
  'UserVoted'
];

const StyledToastContainer = styled(ToastContainer).attrs({
  className: 'toast-container',
  toastClassName: 'toast',
  bodyClassName: 'body',
  progressClassName: 'progress'
})`
  /* .toast-container */
  .toast {
    background-color: ${props => props.theme.foreground};
    color: ${props => props.theme.mutedText};
  }
  button[aria-label='close'] {
    display: none;
  }
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      notifications: []
    };
  }

  componentDidMount() {
    getWeb3
      .then(results => {
        this.props.dispatch(initializeWeb3(results.web3));
        this.props.dispatch(setTartarusAddress(tartarusAddress));
        toast.configure();
        this.checkAdmin();
        this.handleNotifications();
      })
      .catch(() => {
        console.log('Error finding web3.');
      });
  }

  getNotificationTime = async props => {
    const blocksInDay = 5760;
    let currentTime = Date.now();
    let lastNotified = this.props.userSettings[this.props.username]
      .lastNotified;
    let lastBlockNotified = Math.ceil(
      ((currentTime - lastNotified) / 86400000) * blocksInDay
    );
    // console.log(lastBlockNotified);
    return props.number - lastBlockNotified;
  };

  getNotifications = async props => {
    console.log(props)
    let activeNotifications = await Promise.all(
      props.map(event => this.getActiveNotification(event))
    );
    // let activeNotifications = [];
    // console.log(activeNotifications);

    let passiveNotifications = await Promise.all(
      passiveNotificationEvents.map(event => this.getPassiveNotification(event))
    );

    // console.log(passiveNotifications);

    let combinedNotifications = activeNotifications.concat(
      passiveNotifications
    );
    // console.log(combinedNotifications);
    let removeNull = combinedNotifications.flat().filter(item => {
      return item !== undefined && item !== [];
    });
    // combinedNotifications.sort((a, b) => (a.args.time > b.args.time ? 1 : -1));
    // console.log(removeNull);
    return removeNull;
  };

  getPassiveNotification = async props => {
    console.log('getPassiveNotifications');
    const contract = require('truffle-contract');
    const latestBlock = await this.props.web3.eth.getBlock('latest');
    let startingBlock = await this.getNotificationTime(latestBlock);
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    switch (props) {
      case 'AdminBan':
        return new Promise((resolve, reject) => {
          instance
            .AdminBan(
              {
                targetUser: this.props.web3.utils.fromAscii(props.username)
              },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, adminBan) => {
              resolve(adminBan);
            });
        });
      case 'AdminCreated':
        return new Promise((resolve, reject) => {
          instance
            .AdminCreated(
              { targetUser: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, adminCreated) => {
              resolve(adminCreated);
            });
        });
      case 'AdminPaid':
        return new Promise((resolve, reject) => {
          instance
            .AdminPaid(
              { targetUser: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, adminPaid) => {
              resolve(adminPaid);
            });
        });
      case 'AdminUnban':
        return new Promise((resolve, reject) => {
          instance
            .AdminUnban(
              { targetUser: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, adminUnban) => {
              resolve(adminUnban);
            });
        });
      case 'CommentDeleted':
        return new Promise((resolve, reject) => {
          instance
            .CommentDeleted(
              { targetUser: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, commentDeleted) => {
              resolve(commentDeleted);
            });
        });
      // case 'CommentCreated':
      //   return new Promise((resolve, reject) => {
      //     instance
      //       .AdminBan(
      //         { user: this.props.web3.utils.fromAscii(props.username) },
      //         {
      //           fromBlock: 0,
      //           toBlock: 'latest'
      //         }
      //       )
      //       .get((error, commentCreated) => {
      //         resolve(commentCreated);
      //       });
      //   });
      case 'ForumCreated':
        console.log(this.props.username);
        return new Promise((resolve, reject) => {
          console.log(startingBlock);
          instance
            .ForumCreated(
              { user: this.props.web3.utils.fromAscii(this.props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, forums) => {
              console.log(forums);
              resolve(forums);
            });
        });
      case 'ModeratorBan':
        return new Promise((resolve, reject) => {
          instance
            .ModeratorBan(
              { targetUser: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, ModeratorBan) => {
              resolve(ModeratorBan);
            });
        });
      case 'ModeratorUnban':
        return new Promise((resolve, reject) => {
          instance
            .ModeratorUnban(
              { targetUser: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, moderatorUnban) => {
              resolve(moderatorUnban);
            });
        });
      case 'ModeratorCreated':
        return new Promise((resolve, reject) => {
          instance
            .ModeratorCreated(
              { targetUser: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: 0,
                toBlock: 'latest'
              }
            )
            .get((error, moderatorCreated) => {
              console.log(moderatorCreated)
              resolve(moderatorCreated);
            });
        });
      case 'ModeratorPaid':
        return new Promise((resolve, reject) => {
          instance
            .ModeratorPaid(
              { targetUser: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, moderatorPaid) => {
              resolve(moderatorPaid);
            });
        });
      case 'ModeratorRemoved':
        return new Promise((resolve, reject) => {
          instance
            .ModeratorRemoved(
              { targetUser: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, moderatorRemoved) => {
              resolve(moderatorRemoved);
            });
        });
      case 'ModeratorUpdated':
        return new Promise((resolve, reject) => {
          instance
            .ModeratorUpdated(
              { targetUser: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, moderatorUpdated) => {
              resolve(moderatorUpdated);
            });
        });
      // case 'PostCreated':
      //   return new Promise((resolve, reject) => {
      //     instance
      //       .PostCreated(
      //         { user: this.props.web3.utils.fromAscii(props.username) },
      //         {
      //           fromBlock: startingBlock,
      //           toBlock: 'latest'
      //         }
      //       )
      //       .get((error, postCreated) => {
      //         resolve(postCreated);
      //       });
      //   });
      case 'PostRemoved':
        return new Promise((resolve, reject) => {
          instance
            .PostRemoved(
              { targetUser: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, postDeleted) => {
              resolve(postDeleted);
            });
        });
      case 'PostLocked':
        return new Promise((resolve, reject) => {
          instance
            .PostLocked(
              { user: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, postLocked) => {
              resolve(postLocked);
            });
        });
      case 'UserUpdated':
        return new Promise((resolve, reject) => {
          instance
            .UserUpdated(
              { user: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, userUpdated) => {
              resolve(userUpdated);
            });
        });
      case 'UserWithdraw':
        return new Promise((resolve, reject) => {
          instance
            .UserWithdraw(
              { user: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, userWithdraw) => {
              resolve(userWithdraw);
            });
        });
      default:
        return;
    }
  };

  getActiveNotification = async props => {
    console.log('getNotifications');
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    const latestBlock = await this.props.web3.eth.getBlock('latest');
    let startingBlock = await this.getNotificationTime(latestBlock);
    console.log(latestBlock);
    console.log(startingBlock);
    console.log(props)
    if (props.event === 'PostCreated') {
      return new Promise((resolve, reject) => {
        instance
          .CommentCreated(
            { targetId: props.postId },
            {
              fromBlock: startingBlock,
              toBlock: 'latest'
            }
          )
          .get((error, comments) => {
            resolve(...comments);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        instance
          .CommentCreated(
            { postId: props.args.postId, targetId: props.commentId },
            {
              fromBlock: startingBlock,
              toBlock: 'latest'
            }
          )
          .get((error, comments) => {
            resolve(...comments);
          });
      });
    }
  };

  handleNotifications = async () => {
    if (this.props.username !== null && this.props.username !== undefined) {
      console.log('notificati');
      let watchedPosts = this.props.userSettings[this.props.username].watched
        .posts;
      let watchedComments = this.props.userSettings[this.props.username].watched
        .comments;
      let combinedList = watchedPosts.concat(watchedComments);
      let newNotifications = await this.getNotifications(combinedList);
      console.log(newNotifications.length);
      if (newNotifications.length > 0) {
        console.log('test');
        let newNotificationsArray = this.props.userSettings[this.props.username]
          .notifications;
        let payload = {
          username: this.props.username,
          // notifications: []
          notifications: newNotificationsArray.concat(newNotifications)
        };
        this.props.dispatch(updateUserNotifications(payload));
      }
    }
  };

  checkAdmin = () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    tartarus.at(this.props.tartarusAddress).then(instance => {
      instance.getAdmin
        .call(this.props.web3.utils.fromAscii(this.props.username))
        .then(async isAdmin => {
          console.log(isAdmin);
          this.props.dispatch(
            updateUserPermissions({ type: 'admin', permissions: isAdmin })
          );
          this.setState({
            loading: false
          });
        });
    });
  };

  render() {
    if (this.state.loading) {
      return <LoadingIndicatorSpinner />;
    } else {
      return (
        <ThemeProvider theme={theme(this.props.dark)}>
          <HashRouter>
            <>
              <GlobalStyle />
              <Route component={HeaderContainer} />
              <Switch>
                <Route path='/signup' component={SignupFormContainer} />
                <Route path='/login' component={LoginFormContainer} />
                <Route
                  path='/'
                  // onChange={this.handleNotifications()}
                  component={Home}
                />
              </Switch>
              <StyledToastContainer />
            </>
          </HashRouter>
        </ThemeProvider>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    dark: state.theme.dark,
    username: state.user.username,
    tartarusAddress: state.tartarus.tartarusAddress,
    userSettings: state.user.userSettings
  };
}

const AppContainer = connect(mapStateToProps)(App);

export default AppContainer;
