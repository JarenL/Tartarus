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

class ForumSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      showDescription: true,
      showRules: true,
      showModerators: true,
      description: 'None',
      rules: 'None',
      time: null,
      moderator: true,
      moderators: null,
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
        instance.forums
          .call(this.props.web3.utils.fromAscii(this.props.forumName), {
            from: accounts[0],
            gasPrice: 20000000000
          })
          .then(forum => {
            if (
              forum[2] ===
              '0x0000000000000000000000000000000000000000000000000000000000000000'
            ) {
              this.setState({
                loading: false,
                exists: false
              });
            } else {
              const forumInfoHex = '1220' + forum[1].slice(2);
              const forumInfoBytes = Buffer.from(forumInfoHex, 'hex');
              const forumInfoHash = bs58.encode(forumInfoBytes);
              services.ipfs.getJson(forumInfoHash).then(forumInfo => {
                console.log(forumInfo);
                if (forumInfo.description) {
                  this.setState({
                    description: forumInfo.description
                  });
                } else {
                  this.setState({
                    description: 'None'
                  });
                }
                if (forumInfo.rules) {
                  this.setState({
                    rules: forumInfo.rules
                  });
                } else {
                  this.setState({
                    rules: 'None'
                  });
                }
                instance.getModerators
                  .call(this.props.web3.utils.fromAscii(this.props.forumName))
                  .then(moderators => {
                    console.log(moderators);
                    this.setState({
                      loading: false,
                      moderators: moderators
                    });
                  });
              });
            }
          });
      });
    });
  };

  createPostHandler = () => {
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      this.props.history.push(`/f/${this.props.forumName}/createpost`);
    }
  };

  createForumHandler = () => {
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      this.props.history.push(`/createforum`);
    }
  };

  subscribeHandler = () => {
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      let newSubscriptionsArray = this.props.userSettings[
        this.props.username
      ].subscriptions.slice();
      newSubscriptionsArray.push({
        forumName: this.props.forumName
      });
      let payload = {
        username: this.props.username,
        subscriptions: newSubscriptionsArray
      };
      this.props.dispatch(updateUserSubscriptions(payload));
    }
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

  moderateHandler = () => {
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      this.props.history.push('/moderate');
    }
  };

  toggleShowDescription = () => {
    this.setState({ showDescription: !this.state.showDescription });
  };

  toggleShowRules = () => {
    this.setState({ showRules: !this.state.showRules });
  };

  toggleShowModerators = () => {
    this.setState({ showModerators: !this.state.showModerators });
  };

  render() {
    if (this.state.loading) {
      return <LoadingTest />;
    } else {
      console.log(this.state);
      return (
        <Wrapper>
          {this.state.exists ? (
            <CreatePostButton createPostHandler={this.createPostHandler} />
          ) : (
            <CreateForumButton createForumHandler={this.createForumHandler} />
          )}
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
            forumName={this.props.forumName}
            showModerators={this.state.showModerators}
            toggleShowModerators={this.toggleShowModerators}
            moderateHandler={this.moderateHandler}
            moderators={this.state.moderators}
            web3={this.props.web3}
          />
        </Wrapper>
      );
    }
  }
}

export default withRouter(ForumSidebar);
