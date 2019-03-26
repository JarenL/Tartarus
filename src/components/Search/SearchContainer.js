import { connect } from 'react-redux';
import { compose } from 'redux';
import ResultList from './ResultList';

const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress
});

const enhance = compose(
  // reduxForm({ form: 'search' }),
  connect(
    mapStateToProps
    // mapDispatchToProps
  )
);

const SearchContainer = enhance(ResultList);

export default SearchContainer;
