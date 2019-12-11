import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, reset } from 'redux-form';
import TestFilter from './TestFilter';

const mapDispatchToProps = { reset };

const mapStateToProps = state => ({
  user: state.user,
  form: state.form
});

const enhance = compose(
  reduxForm({
    form: 'postFilter',
    initialValues: { time: 'day', type: 'new' },
    destroyOnUnmount: false
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

const PostFilter = enhance(TestFilter);

export default PostFilter;
