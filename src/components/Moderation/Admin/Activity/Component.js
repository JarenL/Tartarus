import React from 'react';
import Empty from '../../../shared/Empty';
import TartarusContract from '../../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../../shared/LoadingIndicator/Spinner';
import ReactList from 'react-list';
import ActivityItem from './ActivityItem';

const blocksInDay = 5760;

class Activity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admins: [],
      adminEvents: [],
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  instantiateContract = () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    const forumBytes = this.props.web3.utils.fromAscii(this.props.forumName);
    tartarus.setProvider(this.props.web3.currentProvider);
    // todo create options variable to cut down repeats
    tartarus
      .at(this.props.tartarusAddress)
      .then(instance => {
        instance
          .AdminCreated(
            {
              forum: forumBytes
            },
            {
              fromBlock: 0,
              toBlock: 'latest'
            }
          )
          .get((error, adminsCreated) => {
            // console.log(moderatorsCreated);
            instance
              .AdminUpdated(
                {
                  forum: forumBytes
                },
                {
                  fromBlock: 0,
                  toBlock: 'latest'
                }
              )
              .get((error, adminsUpdated) => {
                // console.log(moderatorsUpdated);
                instance
                  .AdminRemoved(
                    {
                      forum: forumBytes
                    },
                    {
                      fromBlock: 0,
                      toBlock: 'latest'
                    }
                  )
                  .get((error, adminsRemoved) => {
                    // console.log(moderatorsRemoved);
                    instance
                      .AdminBan(
                        {
                          forum: forumBytes
                        },
                        {
                          fromBlock: 0,
                          toBlock: 'latest'
                        }
                      )
                      .get((error, usersBanned) => {
                        // console.log(usersBanned);
                        instance
                          .AdminUnban(
                            {
                              forum: forumBytes
                            },
                            {
                              fromBlock: 0,
                              toBlock: 'latest'
                            }
                          )
                          .get((error, usersUnbanned) => {
                            // console.log(usersUnbanned);
                            instance
                              .AdminPaid(
                                {
                                  forum: forumBytes
                                },
                                {
                                  fromBlock: 0,
                                  toBlock: 'latest'
                                }
                              )
                              .get((error, adminsPaid) => {
                                // console.log(moderatorsPaid);

                                let adminEventsArray = [].concat.apply(
                                  [],
                                  [
                                    adminsCreated,
                                    adminsUpdated,
                                    adminsRemoved,
                                    usersBanned,
                                    usersUnbanned,
                                    adminsPaid
                                  ]
                                );
                                console.log(adminEventsArray);
                                adminEventsArray.sort((a, b) =>
                                  b.args.time.c[0] > a.args.time.c[0] ? 1 : -1
                                );
                                this.setState({
                                  adminEvents: adminEventsArray,
                                  loading: false
                                });
                              });
                          });
                      });
                  });
              });
          });
      })
      .catch(err => {
        console.log('error');
      });
  };

  renderItem(index, key) {
    return (
      <ActivityItem
        key={key}
        tartarusAddress={this.props.tartarusAddress}
        event={this.state.moderatorEvents[index]}
        web3={this.props.web3}
        username={this.props.username}
      />
    );
  }

  render() {
    console.log(this.state.adminEvents);
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.adminEvents || this.state.adminEvents.length === 0) {
      return <Empty />;
    } else {
      return (
        <ReactList
          itemRenderer={this.renderItem.bind(this)}
          length={this.state.adminEvents.length}
          type='simple'
        />
      );
    }
  }
}

export default Activity;
