import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import validate from './validate';
import SignupForm from './Component';

const mapStateToProps = state => ({
  web3: state.web3,
  form: state.form,
  tartarusAddress: state.tartarus.tartarusAddress
});

const enhance = compose(
  reduxForm({ form: 'signup', validate }),
  connect(mapStateToProps)
);

const SignupFormContainer = enhance(SignupForm);

export default SignupFormContainer;
