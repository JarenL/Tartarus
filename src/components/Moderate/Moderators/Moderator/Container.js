import React from 'react';
import TartarusContract from '../../../../contracts/Tartarus.json';
import Moderator from './Component';
import LoadingBubble from '../../../shared/LoadingIndicator/Bubble';
import { connect } from 'react-redux';
import { compose } from 'redux';

class ModeratorContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moderator: null,
      permissions: [],
      showDetails: false,
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  toggleShowDetails = () => {
    this.setState({ showDetails: !this.state.showDetails });
  };

  instantiateContract = () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    console.log(this.props);
    tartarus.setProvider(this.props.web3.currentProvider);
    tartarus
      .at(this.props.tartarusAddress)
      .then(instance => {
        instance.getModerator
          .call(
            this.props.moderator,
            this.props.web3.utils.fromAscii(this.props.forumName)
          )
          .then(moderator => {
            console.log(moderator);
            this.setState({
              loading: false,
              moderator: this.props.web3.utils.toAscii(this.props.moderator),
              permissions: moderator
            });
          });
      })
      .catch(err => {
        console.log('error');
      });
  };

  render() {
    if (this.state.loading) return <LoadingBubble />;
    console.log(this.state.permissions)
    return (
      <Moderator
        moderator={this.state.moderator}
        permissions={this.state.permissions}
        showDetails={this.state.showDetails}
        toggleShowDetails={this.toggleShowDetails}
        forumName={this.props.forumName}
      />
    );
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress,
  userSettings: state.user.userSettings,
  username: state.user.username,
  userPermissions: state.user.userPermissions
});

const enhance = compose(connect(mapStateToProps));

const ConnectedModeratorContainer = enhance(ModeratorContainer);

export default ConnectedModeratorContainer;
