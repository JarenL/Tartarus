import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
// import withAuth from '../../util/withAuth';
// import { attemptLogin } from '../../actions/auth';
import LoginForm from './Component';

const mapStateToProps = state => ({
  // loading: state.auth.loading
});

const enhance = compose(
  reduxForm({ form: 'login' }),
  connect(mapStateToProps)
);

const LoginFormContainer = enhance(LoginForm);

export default LoginFormContainer;
