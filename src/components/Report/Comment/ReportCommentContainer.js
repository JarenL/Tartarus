import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import ReportComment from './ReportComment';
import { reportValidator } from '../../../services/validators';

const mapStateToProps = state => ({
  web3: state.web3,
  form: state.form,
  username: state.user.username,
  tartarusAddress: state.tartarus.tartarusAddress
});

const enhance = compose(
  reduxForm({ form: 'report', reportValidator }),
  connect(mapStateToProps)
);

const ReportCommentContainer = enhance(ReportComment);

export default ReportCommentContainer;
