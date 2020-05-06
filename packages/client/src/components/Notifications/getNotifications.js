import TartarusContract from '../../contracts/Tartarus.json';
import { connect } from 'react-redux';

const activeNotificationEvents = ['CommentCreated', 'PostCreated'];
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

//props
// latestBlock (number)
// userLastNotified (ms)

const getNotificationTime = async props => {
  const blocksInDay = 5760;
  // const latestBlock = await this.props.web3.eth.getBlock('latest');
  const latestBlock = props.latestBlock;
  const currentTime = Date.now();
  // let lastNotified = this.props.userSettings[this.props.username].lastNotified;
  const lastNotified = props.lastNotified;
  let lastBlockNotified = Math.ceil(
    ((currentTime - lastNotified) / 86400000) * blocksInDay
  );
  // console.log(lastBlockNotified);
  return latestBlock - lastBlockNotified;
};

// web3
// tartarusInstance
// username
// usersettings

let getNotifications = async props => {
  let getNotificationFunctions = [
    getActiveNotifications(),
    getPassiveNotifications()
  ];
  let notifications = await Promise.all(
    getNotificationFunctions.map(callback => {
      callback(props);
    })
  );
  return notifications;
};

const getActiveNotifications = async props => {
  let activeNotifications = await Promise.all(
    activeNotificationEvents.map(event => getActiveNotification(event))
  );
  let removeNull = activeNotifications.filter(item => {
    return item !== undefined;
  });
  return removeNull;
};

const getPassiveNotifications = async props => {
  let passiveNotifications = await Promise.all(
    passiveNotificationEvents.map(event => getPassiveNotification(event))
  );
  let removeNull = passiveNotifications.filter(item => {
    return item !== undefined;
  });
  return removeNull;
};

const getActiveNotification = () => {
  
}

const getPassiveNotification = async props => {
  console.log('getNotifications');
  const latestBlock = await this.props.web3.eth.getBlock('latest');
  let startingBlock = await this.getNotificationTime(latestBlock);
  const tartarus = contract(TartarusContract);
  tartarus.setProvider(this.props.web3.currentProvider);
  tartarus.at(this.props.tartarusAddress).then(instance => {
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
      case 'CommentCreated':
        return new Promise((resolve, reject) => {
          instance
            .AdminBan(
              { user: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, commentCreated) => {
              resolve(commentCreated);
            });
        });
      case 'ForumCreated':
        return new Promise((resolve, reject) => {
          instance
            .ForumCreated(
              { user: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, forumCreated) => {
              resolve(forumCreated);
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
      case 'ModeratorCreated':
        return new Promise((resolve, reject) => {
          instance
            .ModeratorCreated(
              { targetUser: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, moderatorCreated) => {
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
      case 'PostCreated':
        return new Promise((resolve, reject) => {
          instance
            .PostDeleted(
              { user: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, postCreated) => {
              resolve(postCreated);
            });
        });
      case 'PostRemoved':
        return new Promise((resolve, reject) => {
          instance
            .PostDeleted(
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
      case 'UserCreated':
        return new Promise((resolve, reject) => {
          instance
            .UserCreated(
              { user: this.props.web3.utils.fromAscii(props.username) },
              {
                fromBlock: startingBlock,
                toBlock: 'latest'
              }
            )
            .get((error, userCreated) => {
              resolve(bans);
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
  });
};

function mapStateToProps(state) {
  return {
    web3: state.web3,
    username: state.user.username,
    userSettings: state.user.userSettings,
    tartarusAddress: state.tartarus.tartarusAddress
  };
}

export default connect(mapStateToProps)(getNotifications);
