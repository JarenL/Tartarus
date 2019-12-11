import React from 'react';
import TartarusContract from '../../../../../contracts/Tartarus.json.js';
import Admin from './Component';
import LoadingBubble from '../../../../shared/LoadingIndicator/Bubble';
import { connect } from 'react-redux';
import { compose } from 'redux';

class AdminContainer extends React.Component {
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

  instantiateContract = async () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    console.log(this.props);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    let admin = await instance.getAdmin.call(this.props.admin);
    this.setState({
      loading: false,
      admin: this.props.web3.utils.toAscii(this.props.admin),
      permissions: admin
    });
  };

  render() {
    if (this.state.loading) return <LoadingBubble />;
    console.log(this.state.permissions);
    return (
      <Admin
        admin={this.state.admin}
        permissions={this.state.permissions}
        showDetails={this.state.showDetails}
        toggleShowDetails={this.toggleShowDetails}
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

const ConnectedAdminContainer = enhance(AdminContainer);

export default ConnectedAdminContainer;
