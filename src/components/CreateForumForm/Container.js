import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import CreateForumForm from './Component';
import {
  forumNameValidator,
  forumDescriptionValidator,
  forumRulesValidator
} from '../../services/validators';

const validate = fields => {
  const errors = {};
  const forumName = fields.forumName ? fields.forumName : '';
  const forumDescription = fields.forumDescription ? fields.forumDescription : '';
  const forumRules = fields.forumRules ? fields.forumRules : '';

  errors.forumName = forumNameValidator(forumName);
  errors.forumDescription = forumDescriptionValidator(forumDescription);
  errors.forumRules = forumRulesValidator(forumRules);
  return errors;
};

const mapStateToProps = state => ({
  web3: state.web3,
  form: state.form,
  username: state.user.username,
  tartarusAddress: state.tartarus.tartarusAddress
});

const enhance = compose(
  reduxForm({
    form: 'createForum',
    validate
  }),
  connect(mapStateToProps)
);

const CreateForumFormContainer = enhance(CreateForumForm);

export default CreateForumFormContainer;
