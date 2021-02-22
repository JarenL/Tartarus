import React, { Component } from 'react';
import styled from 'styled-components/macro';
// import { Route, Switch } from 'react-router-dom';
import Empty from '../../shared/Empty';
import ModeratorsContainer from './Moderators/Container';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner';
import CreateModeratorFormContainer from '../../CreateModeratorForm/Container';
import NotAuthorized from '../../shared/NotAuthorized';
import ActivityContainer from './Activity/Container';
import InfoContainer from './Info/Container';
import BannedContainer from './Banned/Container';
import RemovedContainer from './Removed/Container';
import ReportsContainer from './Reports/Container';

const Wrapper = styled.div`
  display: flex;
  height: auto;
  background-color: ${props => props.theme.foreground};
`;

const Space = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: 10px;
  background-color: ${props => props.theme.pageBackground};
`;

class Moderate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModerator: false,
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract() {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    console.log(this.props.username);
    console.log(this.props.forumName);
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
            console.log(isModerator);
            if (isModerator) {
              instance.getModerator
                .call(
                  this.props.web3.utils.fromAscii(this.props.username),
                  this.props.web3.utils.fromAscii(this.props.forumName),
                  {
                    from: accounts[0],
                    gasPrice: 20000000000
                  }
                )
                .then(moderator => {
                  console.log(moderator);
                  this.setState({
                    isModerator: true,
                    loading: false
                  });
                });
            } else {
              this.setState({
                loading: false
              });
            }
          });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <LoadingIndicatorSpinner />;
    } else {
      if (this.state.isModerator) {
        switch (this.props.type) {
          case 'activity':
            return <ActivityContainer forumName={this.props.forumName} />;
          case 'moderators':
            return <ModeratorsContainer forumName={this.props.forumName} />;
          case 'info':
            return <InfoContainer forumName={this.props.forumName} />;

          case 'banned':
            return <BannedContainer forumName={this.props.forumName} />;
          case 'create':
            return (
              <>
                <CreateModeratorFormContainer
                  forumName={this.props.forumName}
                />
                <Space />
                <ModeratorsContainer forumName={this.props.forumName} />
              </>
            );
          case 'removed':
            return <RemovedContainer forumName={this.props.forumName} />;
          case 'reports':
            return <ReportsContainer forumName={this.props.forumName} />;

          default:
            return <Empty />;
        }
      } else {
        return <NotAuthorized />;
      }
    }
  }
}

export default Moderate;
