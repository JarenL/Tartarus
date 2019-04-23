import React, { Component } from 'react';
import TartarusContract from '../../../contracts/Tartarus.json';
import styled from 'styled-components/macro';
import { updateUserSubscriptions } from '../../../redux/actions/actions';
import CreateForumButton from './CreateForum.js';
import { withRouter } from 'react-router-dom';
import LoadingTest from '../../shared/LoadingIndicator/LoadingTest.js';
import Trending from './Trending.js';

const services = require('../../../services');

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

class FrontSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      admin: false,
      admins: [],
      trendingForums: []
    };
  }

  componentDidMount() {
    this.getTrending();
  }

  getTrending = async () => {
    let currentBlock = await this.props.web3.eth.getBlockNumber();
    let startingBlock = currentBlock - 7 * 5760;
    this.getPosts({ currentBlock });
  };

  getPosts = props => {
    console.log(props);
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    tartarus
      .at(this.props.tartarusAddress)
      .then(instance => {
        instance
          .PostCreated(
            {},
            {
              fromBlock: props.currentBlock - 7 * 5760,
              toBlock: 'latest'
            }
          )
          .get((error, weeklyPosts) => {
            console.log(weeklyPosts);
            var weeklyCount = weeklyPosts.reduce(
              (acc, o) => (
                (acc[o.args.forum] = (acc[o.args.forum] || 0) + 1), acc
              ),
              {}
            );
            console.log(weeklyCount);
            console.log(
              weeklyCount[
                '0x646f677300000000000000000000000000000000000000000000000000000000'
              ]
            );
            instance
              .PostCreated(
                {},
                {
                  fromBlock: props.currentBlock - 5760,
                  toBlock: 'latest'
                }
              )
              .get((error, dailyPosts) => {
                console.log(dailyPosts);
                var dailyCount = dailyPosts.reduce(
                  (acc, o) => (
                    (acc[o.args.forum] = (acc[o.args.forum] || 0) + 1), acc
                  ),
                  {}
                );
                console.log(dailyCount);
                console.log(
                  dailyCount[
                    '0x646f677300000000000000000000000000000000000000000000000000000000'
                  ]
                );
                var dailyData = Object.keys(dailyCount);
                let trendingForums = [];
                dailyData.forEach(function(forum) {
                  console.log(forum);
                  console.log(dailyCount[forum]);
                  console.log(weeklyCount[forum]);
                  let forumWeight = {
                    [forum]:
                      (dailyCount[forum] - weeklyCount[forum] / 7) /
                      dailyCount[forum]
                  };
                  trendingForums.push(forumWeight);
                });
                trendingForums.sort(function(a, b) {
                  return (
                    parseFloat(Object.values(a)[0]) -
                    parseFloat(Object.values(b)[0])
                  );
                });
                console.log(dailyData);
                console.log(trendingForums);
                this.setState({
                  trending: trendingForums.reverse().slice(0, 5),
                  loading: false
                });
              });
          });
      })
      .catch(err => {
        console.log('error');
      });
  };

  createForumHandler = () => {
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      this.props.history.push(`/createforum`);
    }
  };

  render() {
    if (this.state.loading) {
      return <LoadingTest />;
    } else {
      console.log(this.state);
      return (
        <Wrapper>
          <CreateForumButton createForumHandler={this.createForumHandler} />
          <Trending forums={this.state.trending} web3={this.props.web3} />
        </Wrapper>
      );
    }
  }
}

export default withRouter(FrontSidebar);
