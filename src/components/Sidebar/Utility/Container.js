import { connect } from 'react-redux';
import { compose } from 'redux';
import UtilitySidebar from './Component';

const mapStateToProps = state => ({
  user: state.user
});

const enhance = compose(connect(mapStateToProps));

const UtilitySidebarContainer = enhance(UtilitySidebar);

export default UtilitySidebarContainer;
