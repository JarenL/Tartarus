import { connect } from 'react-redux';
import { compose } from 'redux';
import Comment from './Component';

const mapStateToProps = state => ({
  web3: state.web3,
  username: state.user.username,
  tartarusAddress: state.tartarus.tartarusAddress
});

const enhance = compose(connect(mapStateToProps));

const DirectCommentContainer = enhance(Comment);

export default DirectCommentContainer;
