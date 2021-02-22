import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import TipForm from './TipForm';

const mapStateToProps = state => ({
  web3: state.web3,
  form: state.form,
  username: state.user.username,
  tartarusAddress: state.tartarus.tartarusAddress
});

const enhance = compose(
  reduxForm({ form: 'tip' }),
  connect(mapStateToProps)
);

const ReportFormContainer = enhance(TipForm);

export default ReportFormContainer;
