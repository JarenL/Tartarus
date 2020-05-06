import { connect } from 'react-redux';
import { compose } from 'redux';
import PostList from './Component';

const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress,
  username: state.user.username,
  time: state.form.filter.values.time,
  type: state.form.filter.values.type
});

const enhance = compose(connect(mapStateToProps));

const PostListContainer = enhance(PostList);

export default PostListContainer;
