import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import CreateForumForm from './Component';
import {
  titleValidator,
  urlValidator,
  forumNameValidator,
  textPostValidator,
  typeValidator
} from '../../services/validators';

const validate = fields => {
  const errors = {};
  const title = fields.title ? fields.title : '';
  const url = fields.url ? fields.url : '';
  const type = fields.type ? fields.type : '';
  const text = fields.text ? fields.text : '';

  errors.title = titleValidator(title);
  if (type === 'link') errors.url = urlValidator(url);
  if (type === 'text') errors.text = textPostValidator(text);
  errors.type = typeValidator(type);

  return errors;
};

const mapStateToProps = state => ({
  web3: state.web3,
  form: state.form,
  userAddress: state.user.userAddress
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
