import Sidebar from './Component';
import { connect } from 'react-redux';
import { compose } from 'redux';

const mapStateToProps = state => ({
  // username: state.user.username
});

const enhance = compose(connect(mapStateToProps));

const SidebarContainer = enhance(Sidebar);

export default SidebarContainer;
