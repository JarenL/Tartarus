import { connect } from 'react-redux';
import { compose } from 'redux';
import SearchResults from './SearchResults';

const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress,
  username: state.user.username,
});

const enhance = compose(
  // reduxForm({ form: 'search' }),
  connect(
    mapStateToProps
    // mapDispatchToProps
  )
);

const SearchResultsContainer = enhance(SearchResults);

export default SearchResultsContainer;
