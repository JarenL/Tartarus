import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import SignupForm from './Component';
import { usernameValidator } from '../../services/validators';

const mapStateToProps = state => ({
  web3: state.web3,
  form: state.form,
  tartarusAddress: state.tartarus.tartarusAddress,
  username: state.user.username
});

const enhance = compose(
  reduxForm({ form: 'signup', usernameValidator }),
  connect(mapStateToProps)
);

const SignupFormContainer = enhance(SignupForm);

export default SignupFormContainer;
