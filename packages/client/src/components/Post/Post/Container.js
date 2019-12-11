import { connect } from 'react-redux';
import { compose } from 'redux';
import Post from './Component';

const mapStateToProps = state => ({
  web3: state.web3,
  username: state.user.username,
  userSettings: state.user.userSettings,
  userPermissions: state.user.userPermissions,
  tartarusAddress: state.tartarus.tartarusAddress,
  dark: state.theme.dark
});

const enhance = compose(connect(mapStateToProps));

const PostContainer = enhance(Post);

export default PostContainer;
