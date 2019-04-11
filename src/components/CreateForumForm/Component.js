import React from 'react';
import { Field } from 'redux-form';
import Form from '../shared/form/Form';
import renderField from '../shared/form/renderField';
import SubmitButton from '../shared/form/SubmitButton';
import UserContract from '../../contracts/User.json';

class CreateForumForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  createForum = () => {
    console.log(this.props)
    if (this.props.userAddress === null) {
      this.props.history.push('/login');
    } else {
      this.setState({
        loading: true
      });
      const contract = require('truffle-contract');
      const user = contract(UserContract);
      user.setProvider(this.props.web3.currentProvider);
      this.props.web3.eth.getAccounts((error, accounts) => {
        user.at(this.props.userAddress).then(instance => {
          instance
            .createForum(this.props.form.createForum.values.forumName, {
              from: accounts[0],
              gasPrice: 20000000000
            })
            .then(result => {
              console.log(result);
              this.setState({
                loading: false
              });
            });
        });
      });
    }
  };

  render() {
    return (
      <Form
        loading={this.state.loading}
        // onSubmit={this.props.handleSubmit(this.createForum)}
        wide
      >
        <Field
          name='forumName'
          label='forum name'
          type='text'
          component={renderField}
        />
        <Field
          name='forunDescription'
          label='forum description'
          type='textarea'
          component={renderField}
        />
        <SubmitButton onClick={this.createForum}>create forum</SubmitButton>
      </Form>
    );
  }
}

export default CreateForumForm;
