import { connect } from 'react-redux';
import { compose } from 'redux';
import CommentList from './Component';

export const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress,
  userSettings: state.user.userSettings,
  username: state.user.username,
  time: state.form.filter.values.time,
  type: state.form.filter.values.type
});

const enhance = compose(connect(mapStateToProps));

const CommentListContainer = enhance(CommentList);

export default CommentListContainer;
