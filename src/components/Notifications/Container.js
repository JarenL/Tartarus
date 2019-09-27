import { connect } from 'react-redux';
import { compose } from 'redux';
import Notifications from './Component';

const mapStateToProps = state => ({
  web3: state.web3,
  username: state.user.username,
  userSettings: state.user.userSettings,
  tartarusAddress: state.tartarus.tartarusAddress
});

const enhance = compose(connect(mapStateToProps));

const NotificationsContainer = enhance(Post);

export default NotificationsContainer;
