import { connect } from 'react-redux';
import { compose } from 'redux';
import Comment from './Component';

export const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress,
  username: state.user.username,
  userPermissions: state.user.userPermissions,
  userSettings: state.user.userSettings
});

const enhance = compose(connect(mapStateToProps));

const CommentContainer = enhance(Comment);

export default CommentContainer;
