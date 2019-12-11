import React from 'react';
import Form from '../shared/form/Form';
import { Field } from 'redux-form';
import renderField from '../shared/form/renderField';
import { usernameValidator } from '../../services/validators';
import TartarusContract from '../../contracts/Tartarus.json';
import { userLogin, updateUserPermissions } from '../../redux/actions/actions';
import styled from 'styled-components/macro';
import CancelButton from '../Buttons/CancelButton';
import SubmitButton from '../Buttons/SubmitButton';
import { loginFailToast, loginSuccessToast } from '../Notifications/Toasts/Toast';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  margin-top: 5px;
`;

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
    if (this.props.user.username) this.props.history.push('/');
  }

  handleCancel = () => {
    this.props.reset('login');
    this.props.history.goBack();
  };

  onSubmit = async () => {
    this.redirectIfLoggedIn();
    this.setState({
      loading: true
    });
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let accounts = await this.props.web3.eth.getAccounts();
    let instance = await tartarus.at(this.props.tartarusAddress);
    let user = await instance.users.call(
      this.props.web3.utils.fromAscii(this.props.form.login.values.username),
      {
        from: accounts[0],
        gasPrice: 20000000000
      }
    );
    console.log(user[2]);
    console.log(accounts[0]);
    console.log(user[2] === accounts[0]);
    // 0x366Ebde1b1cbCF95b35e1bd85de01D48f9F1eFC6
    if (
      user[2] !== '0x0000000000000000000000000000000000000000' &&
      this.props.web3.utils.toChecksumAddress(user[2]) === accounts[0]
    ) {
      instance.getAdmin
        .call(
          this.props.web3.utils.fromAscii(this.props.form.login.values.username)
        )
        .then(admin => {
          console.log(admin);
          let permissionsObject = {
            type: 'admin',
            permissions: admin
          };
          this.props.dispatch(updateUserPermissions(permissionsObject));
          this.props.dispatch(
            userLogin({
              username: this.props.form.login.values.username
            })
          );
          this.setState({
            loading: false
          });
          loginSuccessToast();
        });
    } else {
      this.setState({
        loading: false
      });
      loginFailToast();
    }

    this.redirectIfLoggedIn();
  };

  render() {
    return (
      <Form
        loading={this.state.loading}
        onSubmit={this.props.handleSubmit(this.onSubmit)}
      >
        <Field
          name='username'
          label='username'
          type='text'
          component={renderField}
          validate={usernameValidator}
        />
        <Wrapper>
          <SubmitButton />
          <CancelButton onClick={this.handleCancel} />
        </Wrapper>
      </Form>
    );
  }
}

export default LoginForm;
