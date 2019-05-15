import React, { Component } from 'react';
import TartarusContract from '../../../contracts/Tartarus.json';
import styled from 'styled-components/macro';
import ForumHeader from './ForumHeader';
import ForumRules from './ForumRules.js';
import LoadingBubble from '../../shared/LoadingIndicator/Bubble.js';
import ForumModerators from './ForumModerators.js';
import ForumDescription from './ForumDescription.js';
import { updateUserSubscriptions } from '../../../redux/actions/actions';
import Subscribe from './Subscribe.js';
import CreatePostButton from './CreatePost.js';
import CreateForumButton from './CreateForum.js';
import { withRouter } from 'react-router-dom';
import LoadingTest from '../../shared/LoadingIndicator/LoadingTest.js';

const services = require('../../../services');

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  // border: 1px solid ${props => props.theme.border};
  // background-color: ${props => props.theme.foreground};
`;

class ModeratorSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      // showDescription: true,
      // showRules: true,
      // showModerators: true,
      // description: 'None',
      // rules: 'None',
      // time: null,
      // moderator: true,
      // moderators: null,
      isModerator: false,
      exists: true
    };
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract = () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    const bs58 = require('bs58');
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.isModerator
          .call(
            this.props.web3.utils.fromAscii(this.props.username),
            this.props.web3.utils.fromAscii(this.props.forumName),
            {
              from: accounts[0],
              gasPrice: 20000000000
            }
          )
          .then(isModerator => {
            if (isModerator) {
              this.setState({
                isModerator: true
              })
              instance.getModerator.call(
                this.props.web3.utils.fromAscii(this.props.username),
                this.props.web3.utils.fromAscii(this.props.forumName),
                {
                  from: accounts[0],
                  gasPrice: 20000000000
                }
              )
              .then(moderator => {
                console.log(moderator)
              )
            } 
          });
      });
    });
  };

  unsubscribeHandler = () => {
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      let newSubscriptionsArray = this.props.userSettings[
        this.props.username
      ].subscriptions.slice();
      for (var i = 0; i < newSubscriptionsArray.length; i++) {
        if (newSubscriptionsArray[i].forumName === this.props.forumName) {
          newSubscriptionsArray.splice(i, 1);
        }
      }
      let payload = {
        username: this.props.username,
        subscriptions: newSubscriptionsArray
      };
      this.props.dispatch(updateUserSubscriptions(payload));
    }
  };

  render() {
    if (this.state.loading) {
      return <LoadingTest />;
    } else {
      console.log(this.state);
      return (
        <Wrapper>
          <Subscribe
            username={this.props.username}
            userSettings={this.props.userSettings}
            forumName={this.props.forumName}
            subscribeHandler={this.subscribeHandler}
            unsubscribeHandler={this.unsubscribeHandler}
          />
          <ForumHeader name={this.props.forumName} />
          <ForumDescription
            showDescription={this.state.showDescription}
            toggleShowDescription={this.toggleShowDescription}
            forumName={this.props.forumName}
            description={this.state.description}
          />
          <ForumRules
            showRules={this.state.showRules}
            toggleShowRules={this.toggleShowRules}
            rules={this.state.rules}
          />
          <ForumModerators
            username={this.props.username}
            showModerators={this.state.showModerators}
            toggleShowModerators={this.toggleShowModerators}
            moderators={this.state.moderators}
            web3={this.props.web3}
          />
        </Wrapper>
      );
    }
  }
}

export default withRouter(ModeratorSidebar);
