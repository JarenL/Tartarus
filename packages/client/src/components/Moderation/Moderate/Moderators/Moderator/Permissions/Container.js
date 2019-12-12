import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import Permissions from './Component';
// import {
//   forumNameValidator,
//   forumDescriptionValidator,
//   forumRulesValidator
// } from '../../services/validators';

const mapStateToProps = state => ({
  web3: state.web3,
  form: state.form,
  username: state.user.username,
  userPermissions: state.user.userPermissions,
  tartarusAddress: state.tartarus.tartarusAddress
});

const enhance = compose(
  reduxForm({
    form: 'moderatorPermissions'
  }),
  connect(mapStateToProps)
);

const PermissionsContainer = enhance(Permissions);

export default PermissionsContainer;
