import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import CommentReplyForm from './Component';
import { withRouter } from 'react-router';

const mapStateToProps = state => ({
  web3: state.web3,
  form: state.form,
  username: state.user.username,
  tartarusAddress: state.tartarus.tartarusAddress
});

const enhance = compose(
  reduxForm({ form: 'createCommentReply' }),
  connect(mapStateToProps)
);

const CommentReplyFormContainer = enhance(CommentReplyForm);

export default withRouter(CommentReplyFormContainer);
