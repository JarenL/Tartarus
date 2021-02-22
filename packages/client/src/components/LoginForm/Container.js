import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import LoginForm from './Component';

const mapStateToProps = state => ({
  web3: state.web3,
  form: state.form,
  user: state.user,
  tartarusAddress: state.tartarus.tartarusAddress
});

const enhance = compose(
  reduxForm({ form: 'login' }),
  connect(mapStateToProps)
);

const LoginFormContainer = enhance(LoginForm);

export default LoginFormContainer;
