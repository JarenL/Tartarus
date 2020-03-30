import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, reset } from 'redux-form';
import { change } from 'redux-form';
import CreatePostForm from './Component';

import {
  titleValidator,
  urlValidator,
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
  tartarusAddress: state.tartarus.tartarusAddress,
  form: state.form.createPost,
  username: state.user.username
});

const mapDispatchToProps = { change, reset };

const enhance = compose(
  reduxForm({
    form: 'createPost',
    initialValues: { type: 'text' },
    validate
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

const CreatePostFormContainer = enhance(CreatePostForm);

export default CreatePostFormContainer;
