import React, { Component } from 'react';
import { connect } from 'react-redux';
import ForumContract from '../../../contracts/Forum.json';
import Loading from '../../shared/LoadingIndicator/Loading.js';
import styled from 'styled-components/macro';
import ForumHeader from './ForumHeader';
import ForumInfo from './ForumInfo.js';
import ForumRules from './ForumRules.js';
import LoadingBubble from '../../shared/LoadingIndicator/Bubble.js';

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
      showInfo: false,
      showRules: false
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  toggleShowInfo = () => {
    this.setState({ showInfo: !this.state.showInfo });
  };

  toggleShowRules = () => {
    this.setState({ showRules: !this.state.showRules });
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
          <ForumInfo
            showInfo={this.state.showInfo}
            toggleShowInfo={this.toggleShowInfo}
          />
          <ForumRules
            showRules={this.state.showRules}
            toggleShowRules={this.toggleShowRules}
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
