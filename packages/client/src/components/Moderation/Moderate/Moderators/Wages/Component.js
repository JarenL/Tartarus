import React from 'react';
// import Empty from '../../shared/Empty';
import TartarusContract from '../../../../../contracts/Tartarus.json.js';
import LoadingIndicatorSpinner from '../../../../shared/LoadingIndicator/Spinner';
import Chart from './Chart';
import Balance from './Balance';

class Wages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moderators: [],
      moderatorBalance: 0,
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = async () => {
    await Promise.all(
      this.props.moderators.map(moderator => this.getModerator(moderator))
    );
    this.instantiateContract();
  };

  instantiateContract = () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    tartarus
      .at(this.props.tartarusAddress)
      .then(instance => {
        instance.getModerator
          .call(
            this.props.web3.utils.fromAscii(this.props.username),
            this.props.web3.utils.fromAscii(this.props.forumName)
          )
          .then(moderator => {
            instance.forums
              .call(this.props.web3.utils.fromAscii(this.props.forumName))
              .then(forumInfo => {
                console.log(forumInfo);
                console.log(moderator);
                // calculate user's moderator balance
                console.log(moderator[6].toNumber() / 100);
                let moderatorBalance =
                  (moderator[6].toNumber() / 100) *
                  (forumInfo[4].toNumber() - moderator[7].toNumber());
                console.log(moderatorBalance);
                this.setState({
                  moderatorBalance: this.props.web3.utils.fromWei(
                    moderatorBalance.toString(),
                    'ether'
                  ),
                  loading: false
                });
              });
          });
      })
      .catch(err => {
        console.log('error');
      });
  };

  getModerator = props => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    tartarus
      .at(this.props.tartarusAddress)
      .then(instance => {
        instance.getModerator
          .call(props, this.props.web3.utils.fromAscii(this.props.forumName))
          .then(moderator => {
            instance.forums
              .call(this.props.web3.utils.fromAscii(this.props.forumName))
              .then(forumInfo => {
                let moderatorList = this.state.moderators;
                moderatorList.push({
                  name: this.props.web3.utils.toAscii(props),
                  value: moderator[6].c[0]
                });
                this.setState({
                  moderators: moderatorList
                });
              });
          });
      })
      .catch(err => {
        console.log('error');
      });
  };

  handleWithdraw = () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    console.log('witghdraw')
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus
        .at(this.props.tartarusAddress)
        .then(instance => {
          instance.moderatorWithdraw
            .sendTransaction(
              this.props.web3.utils.fromAscii(this.props.username),
              this.props.web3.utils.fromAscii(this.props.forumName),
              {
                from: accounts[0],
                gasPrice: 20000000000
              }
            )
            .then(result => {
              this.setState({
                loading: false
              });
            })
            .catch(function(e) {
              console.log('error');
              this.setState({
                loading: false
              });
            });
        })
        .catch(err => {
          console.log('error');
        });
    });
  };

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.moderators || this.state.moderators.length === 0) {
      return null;
    } else {
      console.log(this.props.username);
      return (
        <>
          <Chart moderators={this.state.moderators} />
          <Balance
            forumName={this.props.web3.utils.fromAscii(this.props.forumName)}
            moderatorBalance={this.state.moderatorBalance}
            username={this.props.username}
            handleWithdraw={this.handleWithdraw}
          />
        </>
      );
    }
  }
}

export default Wages;
