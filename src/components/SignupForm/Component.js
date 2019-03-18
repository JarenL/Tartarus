import React from 'react';
import { Field } from 'redux-form';
import Form from '../shared/form/Form';
import renderField from '../shared/form/renderField';
import { connect } from 'react-redux';
import {
  usernameValidator,
  passwordValidator
} from '../../services/validators';
import SubmitButton from '../shared/form/SubmitButton';
import TartarusContract from '../../contracts/Tartarus.json';

class SignupForm extends React.Component {
  componentDidMount() {
    this.redirectIfLoggedIn();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.redirectIfLoggedIn();
  }

  redirectIfLoggedIn() {
    if (this.props.token) this.props.history.push('/');
  }

  // onSubmit = ({ username, password }) => {
  //   this.props.attemptSignup(username, password);
  // };

  createUser = () => {
    console.log(this.props)
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.createUser({ from: accounts[0], gasPrice: 20000000000 });
      });
    });
  };

  render() {
    return (
      <Form
        loading={this.props.loading}
        onSubmit={this.props.handleSubmit(this.createUser)}
      >
        <Field
          name='username'
          label='username'
          type='text'
          component={renderField}
          validate={usernameValidator}
        />
        {/* <Field
          name='password'
          label='password'
          type='password'
          component={renderField}
          validate={passwordValidator}
        />
        <Field
          name='password2'
          label='confirm password'
          type='password'
          component={renderField}
        /> */}
        <SubmitButton type='submit'>sign up</SubmitButton>
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress,
  accounts: state.accounts,
  currentUserAddress: state.accounts.currentUserAddress
});

export default connect(mapStateToProps)(SignupForm);