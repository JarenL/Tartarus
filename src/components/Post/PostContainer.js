import { connect } from 'react-redux';
import { compose } from 'redux';
import Post from './Post';

export const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress,
  username: state.user.username,
  userSettings: state.user.userSettings
});

const enhance = compose(connect(mapStateToProps));

const PostContainer = enhance(Post);

export default PostContainer;
