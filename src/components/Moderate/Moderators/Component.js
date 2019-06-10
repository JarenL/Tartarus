import React from 'react';
import Empty from '../../shared/Empty';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner';
import ReactList from 'react-list';
import ModeratorContainer from './Moderator/Container';
import WagesContainer from './Wages/Container';
import styled from 'styled-components/macro';

const blocksInDay = 5760;

const Space = styled.div`
  display: flex;
  width: 100%;
  height: 10px;
  background-color: ${props => props.theme.pageBackground};
`;

class Moderators extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moderators: [],
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
    tartarus.setProvider(this.props.web3.currentProvider);
    tartarus
      .at(this.props.tartarusAddress)
      .then(instance => {
        instance.getModerators
          .call(this.props.web3.utils.fromAscii(this.props.forumName))
          .then(moderators => {
            this.setState({
              loading: false,
              moderators: moderators
            });
          });
      })
      .catch(err => {
        console.log('error');
      });
  };

  renderItem(index, key) {
    console.log(this.props.forumName);
    return (
      <ModeratorContainer
        key={key}
        moderator={this.state.moderators[index]}
        forumName={this.props.forumName}
      />
    );
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.moderators || this.state.moderators.length === 0) {
      return <Empty />;
    } else {
      console.log(this.state.moderators);
      return (
        <>
          <WagesContainer
            moderators={this.state.moderators}
            forumName={this.props.forumName}
          />
          <Space />
          <ReactList
            itemRenderer={this.renderItem.bind(this)}
            length={this.state.moderators.length}
            type='simple'
          />
        </>
      );
    }
  }
}

export default Moderators;
