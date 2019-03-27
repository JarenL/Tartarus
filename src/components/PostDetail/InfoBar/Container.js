import { connect } from 'react-redux';
import { compose } from 'redux';
// import withAuth from '../../../util/withAuth';
// import { attemptDeletePost } from '../../../redux/actions/posts';
import PostDetailInfoBar from './Component';

export const mapStateToProps = state => ({
  web3: state.web3,
  username: state.user.username
});
const enhance = compose(connect(mapStateToProps));

const PostDetailInfoBarContainer = enhance(PostDetailInfoBar);

export default PostDetailInfoBarContainer;
