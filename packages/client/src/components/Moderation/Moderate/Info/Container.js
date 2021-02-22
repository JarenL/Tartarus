import Info from './Component';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import {
  forumDescriptionValidator,
  forumRulesValidator
} from '../../../../services/validators';

const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress,
  userSettings: state.user.userSettings,
  username: state.user.username,
  userPermissions: state.user.userPermissions,
  form: state.form
});

const enhance = compose(
  reduxForm({
    form: 'editForum',
    forumDescriptionValidator,
    forumRulesValidator
  }),
  connect(mapStateToProps)
);
const InfoContainer = enhance(Info);

export default InfoContainer;
