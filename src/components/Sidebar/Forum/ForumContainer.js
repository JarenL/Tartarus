import React, { Component } from 'react';
import { connect } from 'react-redux';
import ForumContract from '../../../contracts/Forum.json';
import styled from 'styled-components/macro';
import ForumHeader from './ForumHeader';
import ForumRules from './ForumRules.js';
import LoadingBubble from '../../shared/LoadingIndicator/Bubble.js';
import ForumModerators from './ForumModerators.js';
import ForumDescription from './ForumDescription.js';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

class ForumContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      loading: true,
      showDescription: false,
      showRules: false,
      showModerators: false,
      moderator: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  toggleShowDescription = () => {
    this.setState({ showDescription: !this.state.showDescription });
  };

  toggleShowRules = () => {
    this.setState({ showRules: !this.state.showRules });
  };

  toggleShowModerators = () => {
    this.setState({ showModerators: !this.state.showModerators });
  };

  instantiateContract() {
    const contract = require('truffle-contract');
    const forum = contract(ForumContract);
    forum.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      forum.at(this.props.forumAddress).then(instance => {
        instance.name
          .call({
            from: accounts[0],
            gasPrice: 20000000000
          })
          .then(result => {
            this.setState({
              name: this.props.web3.utils.hexToAscii(result),
              loading: false
            });
          });
      });
    });
  }
  render() {
    if (this.state.loading) {
      return <LoadingBubble />;
    } else {
      return (
        <Wrapper>
          <ForumHeader
            name={this.state.name}
            address={this.props.forumAddress}
          />
          <ForumModerators
            showModerators={this.state.showModerators}
            toggleShowModerators={this.toggleShowModerators}
          />
          <ForumDescription
            showDescription={this.state.showDescription}
            toggleShowDescription={this.toggleShowDescription}
            description={'blah blah blah'}
          />
          <ForumRules
            showRules={this.state.showRules}
            toggleShowRules={this.toggleShowRules}
            rules={'blah blah blah'}
          />
        </Wrapper>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3
  };
}

export default connect(mapStateToProps)(ForumContainer);
