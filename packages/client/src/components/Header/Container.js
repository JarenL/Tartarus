import { connect } from 'react-redux';
import { compose } from 'redux';
import Header from './Component';

const mapStateToProps = state => ({
  username: state.user.username,
  userSettings: state.user.userSettings,
  web3: state.web3
});

const enhance = compose(
  // reduxForm({ form: 'search' }),
  connect(mapStateToProps)
);

const HeaderContainer = enhance(Header);

export default HeaderContainer;
