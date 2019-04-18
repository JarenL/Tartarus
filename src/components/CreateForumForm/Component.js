import React from 'react';
import { Field } from 'redux-form';
import Form from '../shared/form/Form';
import renderField from '../shared/form/renderField';
import SubmitButton from '../shared/form/SubmitButton';
import CancelButton from '../shared/form/CancelButton';
import styled from 'styled-components/macro';
import TartarusContract from '../../contracts/Tartarus.json';

const services = require('../../services');

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  margin-top: 5px;
`;

class CreateForumForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  handleSubmit = async () => {
    this.setState({
      loading: true
    });
    let forumDescriptionObject = {
      description: this.props.form.createForum.values.forumDescription
    };
    let forumRulesObject = {
      rules: this.props.form.createForum.values.forumRules
    };
    const forumDescriptionIpfsHash = await services.ipfs.uploadObject(
      forumDescriptionObject
    );
    const forumRulesIpfsHash = await services.ipfs.uploadObject(
      forumRulesObject
    );
    const bs58 = require('bs58');
    const forumDescriptionBytes32 =
      '0x' +
      bs58
        .decode(forumDescriptionIpfsHash)
        .slice(2)
        .toString('hex');
    const forumRulesBytes32 =
      '0x' +
      bs58
        .decode(forumRulesIpfsHash)
        .slice(2)
        .toString('hex');
    console.log(forumDescriptionBytes32);
    console.log(forumRulesBytes32);
    this.createForum({
      description: forumDescriptionBytes32,
      rules: forumRulesBytes32
    });
  };

  handleCancel = () => {
    this.props.reset('createForum');
    this.props.history.goBack();
  };

  createForum = props => {
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      const contract = require('truffle-contract');
      const tartarus = contract(TartarusContract);
      tartarus.setProvider(this.props.web3.currentProvider);
      this.props.web3.eth.getAccounts((error, accounts) => {
        tartarus.at(this.props.tartarusAddress).then(instance => {
          instance.createUserCost.call().then(createForumCost => {
            instance
              .createForum(
                this.props.web3.utils.fromAscii(this.props.username),
                this.props.form.createForum.values.forumName,
                props.rules,
                props.description,
                {
                  from: accounts[0],
                  gasPrice: 20000000000,
                  value: createForumCost
                }
              )
              .then(result => {
                this.setState({
                  loading: false
                });
                this.props.reset('createForum');
                this.props.history.goBack();
              })
              .catch(error => {
                console.log('error');
                this.setState({
                  loading: false
                });
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
        onSubmit={this.props.handleSubmit(this.handleSubmit)}
        wide
      >
        <Field
          name='forumName'
          label='forum name'
          type='text'
          component={renderField}
          validate={this.props.forumNameValidator}
        />
        <Field
          name='forumDescription'
          label='forum description'
          type='editor'
          component={renderField}
          validate={this.props.forumDescriptionValidator}
        />
        <Field
          name='forumRules'
          label='forum rules'
          type='editor'
          component={renderField}
          validate={this.props.forumRulesValidator}
        />
        <Wrapper>
          <SubmitButton />
          <CancelButton onClick={this.handleCancel} />
        </Wrapper>
      </Form>
    );
  }
}

export default CreateForumForm;
