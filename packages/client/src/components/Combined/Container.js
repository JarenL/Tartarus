import { connect } from 'react-redux';
import { compose } from 'redux';
import CombinedList from './Component';

const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress,
  username: state.user.username,
  userSettings: state.user.userSettings,
  time: state.form.filter.values.time
});

const enhance = compose(connect(mapStateToProps));

const CombinedListContainer = enhance(CombinedList);

export default CombinedListContainer;
