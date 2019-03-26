import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import CommentForm from './Component';
import { withRouter } from 'react-router';

const mapStateToProps = state => ({
  web3: state.web3,
  form: state.form,
  userAddress: state.user.userAddress
  // currentUserAddress: state.accounts.currentUserAddress
});

const enhance = compose(
  reduxForm({ form: 'comment' }),
  connect(mapStateToProps)
);

const CommentFormContainer = enhance(CommentForm);

export default withRouter(CommentFormContainer);
