import React from 'react';
import Empty from '../../shared/Empty';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner';
import ReactList from 'react-list';
import ActivityItem from './ActivityItem';

const blocksInDay = 5760;

class Activity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moderators: [],
      moderatorEvents: [],
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  // componentDidUpdate = (newProps, oldProps) => {
  //   if (newProps.time !== this.props.time) {
  //     this.setState({
  //       loading: true
  //     });
  //     this.instantiateContract();
  //   }

  //   if (newProps.type !== this.props.type) {
  //     this.setState({
  //       loading: true
  //     });
  //     this.instantiateContract();
  //   }

  //   if (newProps.username !== this.props.username) {
  //     this.setState({
  //       loading: true
  //     });
  //     this.instantiateContract();
  //   }
  // };

  // handlePostTime = async () => {
  //   const latest = await this.props.web3.eth.getBlock('latest');
  //   switch (this.props.time) {
  //     case 'day':
  //       return latest.number - 1 * blocksInDay;
  //     case 'week':
  //       return latest.number - 7 * blocksInDay;
  //     case 'month':
  //       return latest.number - 30 * blocksInDay;
  //     case 'year':
  //       return latest.number - 365 * blocksInDay;
  //     case 'all':
  //       return 0;
  //     default:
  //       return null;
  //   }
  // };

  // handlePostType = props => {
  //   switch (this.props.type) {
  //     case 'top':
  //       return null;
  //     case 'hot':
  //       return null;
  //     case 'new':
  //       return props.reverse();
  //     case 'old':
  //       return props;
  //     default:
  //       return props;
  //   }
  // };

  // handleTop = props => {
  //   console.log('top');
  // };

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
          .ModeratorCreated(
            {
              forum: forumBytes
            },
            {
              fromBlock: 0,
              toBlock: 'latest'
            }
          )
          .get((error, moderatorsCreated) => {
            // console.log(moderatorsCreated);
            instance
              .ModeratorUpdated(
                {
                  forum: forumBytes
                },
                {
                  fromBlock: 0,
                  toBlock: 'latest'
                }
              )
              .get((error, moderatorsUpdated) => {
                // console.log(moderatorsUpdated);
                instance
                  .ModeratorRemoved(
                    {
                      forum: forumBytes
                    },
                    {
                      fromBlock: 0,
                      toBlock: 'latest'
                    }
                  )
                  .get((error, moderatorsRemoved) => {
                    // console.log(moderatorsRemoved);
                    instance
                      .ModeratorBan(
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
                          .ModeratorUnban(
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
                              .ModeratorPaid(
                                {
                                  forum: forumBytes
                                },
                                {
                                  fromBlock: 0,
                                  toBlock: 'latest'
                                }
                              )
                              .get((error, moderatorsPaid) => {
                                // console.log(moderatorsPaid);
                                instance
                                  .ForumCreated(
                                    {
                                      forum: forumBytes
                                    },
                                    {
                                      fromBlock: 0,
                                      toBlock: 'latest'
                                    }
                                  )
                                  .get((error, forumCreated) => {
                                    let moderatorEventsArray = [].concat.apply(
                                      [],
                                      [
                                        moderatorsCreated,
                                        moderatorsUpdated,
                                        moderatorsRemoved,
                                        usersBanned,
                                        usersUnbanned,
                                        moderatorsPaid,
                                        forumCreated
                                      ]
                                    );
                                    console.log(moderatorEventsArray);
                                    moderatorEventsArray.sort((a, b) =>
                                      b.args.time.c[0] > a.args.time.c[0]
                                        ? 1
                                        : -1
                                    );
                                    this.setState({
                                      moderatorEvents: moderatorEventsArray,
                                      loading: false
                                    });
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
        forumName={this.props.forumName}
        event={this.state.moderatorEvents[index]}
        web3={this.props.web3}
        username={this.props.username}
      />
    );
  }

  render() {
    console.log(this.state.moderatorEvents);
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (
      !this.state.moderatorEvents ||
      this.state.moderatorEvents.length === 0
    ) {
      return <Empty />;
    } else {
      return (
        <ReactList
          itemRenderer={this.renderItem.bind(this)}
          length={this.state.moderatorEvents.length}
          type='simple'
        />
      );
    }
  }
}

export default Activity;
