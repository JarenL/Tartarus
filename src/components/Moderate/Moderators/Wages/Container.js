import Wages from './Component';
import { connect } from 'react-redux';
import { compose } from 'redux';

const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress,
  userSettings: state.user.userSettings,
  username: state.user.username,
});

const enhance = compose(connect(mapStateToProps));

const WagesContainer = enhance(Wages);

export default WagesContainer;
