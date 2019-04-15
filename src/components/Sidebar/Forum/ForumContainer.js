import React, { Component } from 'react';
import { connect } from 'react-redux';
import TartarusContract from '../../../contracts/Tartarus.json';
import styled from 'styled-components/macro';
import ForumHeader from './ForumHeader';
import ForumRules from './ForumRules.js';
import LoadingBubble from '../../shared/LoadingIndicator/Bubble.js';
import ForumModerators from './ForumModerators.js';
import ForumDescription from './ForumDescription.js';
import ipfs from '../../../services/ipfs/ipfs';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

class ForumContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      showDescription: false,
      showRules: false,
      showModerators: false,
      description: null,
      rules: null,
      creator: null,
      time: null,
      moderator: true,
      moderators: null
    };
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
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.forums
          .call(this.props.web3.utils.fromAscii(this.props.forumName), {
            from: accounts[0],
            gasPrice: 20000000000
          })
          .then(forum => {
            const bs58 = require('bs58');
            const descriptionHex = '1220' + forum[1].slice(2);
            const descriptionBytes = Buffer.from(descriptionHex, 'hex');
            const descriptionHash = bs58.encode(descriptionBytes);

            const rulesHex = '1220' + forum[2].slice(2);
            const rulesBytes = Buffer.from(rulesHex, 'hex');
            const rulesHash = bs58.encode(rulesBytes);
            ipfs.catJSON(descriptionHash, (err, description) => {
              ipfs.catJSON(rulesHash, (err, rules) => {
                instance
                  .ModeratorCreated(
                    {
                      forum: this.props.web3.utils.fromAscii(
                        this.props.forumName
                      )
                    },
                    { fromBlock: 0, toBlock: 'latest' }
                  )
                  .get((error, moderators) => {
                    this.setState({
                      loading: false,
                      description: description.description,
                      rules: rules.rules,
                      creator: forum[3],
                      time: forum[4].c[0] * 1000,
                      moderators: moderators
                    });
                  });
              });
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
          <ForumHeader name={this.props.forumName} />
          <ForumDescription
            showDescription={this.state.showDescription}
            toggleShowDescription={this.toggleShowDescription}
            description={this.state.description}
          />
          <ForumRules
            showRules={this.state.showRules}
            toggleShowRules={this.toggleShowRules}
            rules={this.state.rules}
          />
          <ForumModerators
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

function mapStateToProps(state) {
  return {
    web3: state.web3,
    tartarusAddress: state.tartarus.tartarusAddress
  };
}

export default connect(mapStateToProps)(ForumContainer);
