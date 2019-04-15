import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import CreateForumForm from './Component';
import {
  forumNameValidator,
  forumDescriptionValidator,
  forumRulesValidator
} from '../../services/validators';

const mapStateToProps = state => ({
  web3: state.web3,
  form: state.form,
  username: state.user.username,
  tartarusAddress: state.tartarus.tartarusAddress
});

const enhance = compose(
  reduxForm({
    form: 'createForum',
    forumNameValidator,
    forumDescriptionValidator,
    forumRulesValidator
  }),
  connect(mapStateToProps)
);

const CreateForumFormContainer = enhance(CreateForumForm);

export default CreateForumFormContainer;
