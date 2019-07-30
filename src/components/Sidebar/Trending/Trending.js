import React, { Component } from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import TrendingList from './TrendingList';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingTest from '../../shared/LoadingIndicator/LoadingTest.js';
import TrendingButton from '../../Buttons/Trending';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  // border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.foreground};
  // margin-top: 12px;
`;

const HeaderWrapper = styled.div`
  ${wideFont};
  ${overflow};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  color: ${props => props.theme.mutedText};
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Forums = styled.div`
  overflow-wrap: break-word;
  border-left: none;
  padding: 8px;
  font-size: 12px;
  list-style-position: inside;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.normalText};
`;

const ButtonWrapper = styled.div`
  align-self: flex-end;
`;

class Trending extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      admin: false,
      admins: [],
      trending: []
    };
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract = async props => {
    // console.log(props);
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    let currentBlock = await this.props.web3.eth.getBlockNumber();
    tartarus.setProvider(this.props.web3.currentProvider);
    tartarus
      .at(this.props.tartarusAddress)
      .then(instance => {
        instance
          .PostCreated(
            {},
            {
              fromBlock: currentBlock - 7 * 5760,
              toBlock: 'latest'
            }
          )
          .get((error, weeklyPosts) => {
            // console.log(weeklyPosts);
            var weeklyCount = weeklyPosts.reduce(
              (acc, o) => (
                (acc[o.args.forum] = (acc[o.args.forum] || 0) + 1), acc
              ),
              {}
            );
            // console.log(weeklyCount);
            // console.log(
            //   weeklyCount[
            //     '0x646f677300000000000000000000000000000000000000000000000000000000'
            //   ]
            // );
            instance
              .PostCreated(
                {},
                {
                  fromBlock: currentBlock - 5760,
                  toBlock: 'latest'
                }
              )
              .get((error, dailyPosts) => {
                var dailyCount = dailyPosts.reduce(
                  (acc, o) => (
                    (acc[o.args.forum] = (acc[o.args.forum] || 0) + 1), acc
                  ),
                  {}
                );
                // console.log(dailyCount);
                // console.log(
                //   dailyCount[
                //     '0x646f677300000000000000000000000000000000000000000000000000000000'
                //   ]
                // );
                var dailyData = Object.keys(dailyCount);
                let trendingForums = [];
                dailyData.forEach(function(forum) {
                  // console.log(forum);
                  // console.log(dailyCount[forum]);
                  // console.log(weeklyCount[forum]);
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
                // console.log(dailyData);
                // console.log(trendingForums);
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
      return (
        <Wrapper>
          <HeaderWrapper>
            {'Trending Circles'}
            <ButtonWrapper>
              <TrendingButton size={16} />
            </ButtonWrapper>
          </HeaderWrapper>
          <Forums>
            {this.state.trending.length !== 0 ? (
              <TrendingList
                forums={this.state.trending}
                web3={this.props.web3}
              />
            ) : (
              'None'
            )}
          </Forums>
        </Wrapper>
      );
    }
  }
}

export default Trending;
