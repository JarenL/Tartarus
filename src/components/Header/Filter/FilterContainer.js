import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, reset } from 'redux-form';
import Filter from './Filter';

const mapDispatchToProps = { reset };

const mapStateToProps = state => ({
  user: state.user,
  form: state.form
});

const enhance = compose(
  reduxForm({
    form: 'filter',
    initialValues: { time: 'day', type: 'new' },
    destroyOnUnmount: false
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

const FilterContainer = enhance(Filter);

export default FilterContainer;
