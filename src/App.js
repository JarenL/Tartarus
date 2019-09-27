import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
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

// const tartarusAddress = '0x4c905e8c4533cb6928abaa159ca7b45b22f4d086';
// const tartarusAddress = '0x3ca7832b2edd307b075903e2aac2ff04308ad001';
const tartarusAddress = '0xf7226a6478cB98642Fc16B598fFE989A4f76ED6e';

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
        this.checkAdmin();
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
    let notifications = await Promise.all(
      props.map(event => this.getNotification(event))
    );
    let removeNull = notifications.filter(item => {
      return item !== undefined;
    });
    return removeNull;
  };

  getNotification = async props => {
    console.log('getNotifications');
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    const latestBlock = await this.props.web3.eth.getBlock('latest');
    let startingBlock = await this.getNotificationTime(latestBlock);
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
            { targetId: props.commentId },
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
          // await this.handleNotifications();
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
                <Route path='/login' component={LoginFormContainer} />
                <Route path='/signup' component={SignupFormContainer} />
                <Route
                  path='/'
                  onChange={this.handleNotifications()}
                  component={Home}
                />
              </Switch>
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
