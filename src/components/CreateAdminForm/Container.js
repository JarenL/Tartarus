import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import CreateAdminForm from './Component';
import { usernameValidator } from '../../services/validators';
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
  tartarusAddress: state.tartarus.tartarusAddress,
  targetUser: state.form.createAdmin
});

const enhance = compose(
  reduxForm({
    form: 'createModerator',
    usernameValidator
    // forumNameValidator,
    // forumDescriptionValidator,
    // forumRulesValidator
  }),
  connect(mapStateToProps)
);

const CreateAdminFormContainer = enhance(CreateAdminForm);

export default CreateAdminFormContainer;
