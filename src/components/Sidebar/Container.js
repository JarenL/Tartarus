import Sidebar from './Component';
import { connect } from 'react-redux';
import { compose } from 'redux';

const mapStateToProps = state => ({
  user: state.user
});

const enhance = compose(connect(mapStateToProps));

const SidebarContainer = enhance(Sidebar);

export default SidebarContainer;
