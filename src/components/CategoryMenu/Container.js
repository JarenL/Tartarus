import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import CategoryMenu from './Component';

const mapStateToProps = state => ({
  web3: state.web3,
  userAddress: state.user.userAddress,
  userSettings: state.user.userSettings
  // currentUserAddress: state.accounts.currentUserAddress
});

const enhance = compose(connect(mapStateToProps));

const CategoryMenuContainer = enhance(CategoryMenu);

export default withRouter(CategoryMenuContainer);
