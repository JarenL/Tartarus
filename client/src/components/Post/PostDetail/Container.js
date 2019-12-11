import { connect } from 'react-redux';
import { compose } from 'redux';
import PostDetail from './Component';

export const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress
});

const enhance = compose(connect(mapStateToProps));

const PostDetailContainer = enhance(PostDetail);

export default PostDetailContainer;
