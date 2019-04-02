import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, reset } from 'redux-form';
import SearchBox from './Component';

const mapDispatchToProps = { reset };

const mapStateToProps = state => ({
  user: state.user,
  form: state.form
});

const enhance = compose(
  reduxForm({ form: 'search' }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

const SearchContainer = enhance(SearchBox);

export default SearchContainer;
