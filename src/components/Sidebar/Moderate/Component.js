import React, { Component } from 'react';
import TartarusContract from '../../../contracts/Tartarus.json';
import styled from 'styled-components/macro';
import { withRouter } from 'react-router-dom';
import LoadingTest from '../../shared/LoadingIndicator/LoadingTest.js';
import ForumHeader from '../Forum/ForumHeader.js';
import ModerateList from './ModerateList';
import Empty from '../../shared/Empty.js';
import ModerateHeader from './ModerateHeader.js';
import CreateModeratorButton from './CreateModeratorButton.js';
import NotAuthorized from '../../shared/NotAuthorized.js';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

class ModerateSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
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
                isModerator: true,
                loading: false
              });
            } else {
              this.setState({
                loading: false
              })
            }
          });
      });
    });
  };

  createModerator = () => {
    this.props.history.push(`/f/${this.props.forumName}/moderate/moderators/create`);
  }

  render() {
    if (this.state.loading) {
      return <LoadingTest />;
    } else {
      if (!this.state.isModerator) {
        return <NotAuthorized />;
      } else {
        return (
          <Wrapper>
            {this.props.userPermissions.moderator[0] && this.props.createModerator ? (
              <CreateModeratorButton createModerator={this.createModerator} />
            ) : null}
            <ModerateHeader forumName={this.props.forumName} />
            <ModerateList forumName={this.props.forumName} />
          </Wrapper>
        );
      }
    }
  }
}

export default withRouter(ModerateSidebar);
