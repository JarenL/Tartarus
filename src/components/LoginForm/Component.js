import React from 'react';
import Form from '../shared/form/Form';
import { Field } from 'redux-form';
import renderField from '../shared/form/renderField';
import { usernameValidator } from '../../services/validators';
import SubmitButton from '../shared/form/SubmitButton';
import TartarusContract from '../../contracts/Tartarus.json';
import { userLogin } from '../../redux/actions/actions';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    this.redirectIfLoggedIn();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.redirectIfLoggedIn();
  }

  redirectIfLoggedIn() {
    if (this.props.user.userAddress) this.props.history.push('/');
  }

  onSubmit = () => {
    console.log("login")
    this.redirectIfLoggedIn();
    this.setState({
      loading: true
    });
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.users
          .call(this.props.form.login.values.username, {
            from: accounts[0],
            gasPrice: 20000000000
          })
          .then(address => {
            console.log(address)
            if (address === '0x') {
              this.setState({
                loading: false
              });
            } else {
              console.log(address);
              this.props.dispatch(
                userLogin({
                  username: this.props.form.login.values.username,
                  userAddress: address
                })
              );
              this.setState({
                loading: false
              });
            }
          });
      });
    });
    // this.redirectIfLoggedIn();
  };

  render() {
    return (
      <Form
        loading={this.state.loading}
        // onSubmit={this.props.handleSubmit(this.onSubmit)}
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
        /> */}
        <SubmitButton onClick={this.onSubmit}>log in</SubmitButton>
      </Form>
    );
  }
}

export default LoginForm;
