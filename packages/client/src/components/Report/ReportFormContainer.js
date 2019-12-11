import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import ReportForm from './ReportForm';

const mapStateToProps = state => ({
  form: state.form
});

const enhance = compose(
  reduxForm({ form: 'report' }),
  connect(mapStateToProps)
);

const ReportFormContainer = enhance(ReportForm);

export default ReportFormContainer;
