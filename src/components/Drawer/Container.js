import { connect } from 'react-redux';
import { compose } from 'redux';
import AppDrawer from './Component';

const mapStateToProps = state => ({
  drawerState: state.drawer.drawerState,
  username: state.user.username
});

const enhance = compose(connect(mapStateToProps));

const DrawerContainer = enhance(AppDrawer);

export default DrawerContainer;
