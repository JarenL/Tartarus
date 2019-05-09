import React from 'react';
import Form from '../shared/form/Form';
import { Field } from 'redux-form';
import renderField from '../shared/form/renderField';
import { usernameValidator } from '../../services/validators';
import SubmitButton from '../shared/form/SubmitButton';
import TartarusContract from '../../contracts/Tartarus.json';
import { userLogin, updateUserPermissions } from '../../redux/actions/actions';
import styled from 'styled-components/macro';
import CancelButton from '../shared/form/CancelButton';

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

  onSubmit = () => {
    this.redirectIfLoggedIn();
    this.setState({
      loading: true
    });
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        console.log(
          this.props.web3.utils.fromAscii(this.props.form.login.values.username)
        );
        instance.users
          .call(
            this.props.web3.utils.fromAscii(
              this.props.form.login.values.username
            ),
            {
              from: accounts[0],
              gasPrice: 20000000000
            }
          )
          .then(user => {
            console.log(user);
            if (user[2] !== '0x0000000000000000000000000000000000000000') {
              instance.getAdmin
                .call(
                  this.props.web3.utils.fromAscii(
                    this.props.form.login.values.username
                  )
                )
                .then(admin => {
                  console.log(admin);
                  let permissionsObject = {
                    type: 'admin',
                    permissions: admin
                  };
                  this.props.dispatch(updateUserPermissions(permissionsObject));
                });
              this.props.dispatch(
                userLogin({
                  username: this.props.form.login.values.username
                })
              );
            }
            this.setState({
              loading: false
            });
          });
      });
    });
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
