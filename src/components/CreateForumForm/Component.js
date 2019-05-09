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
    let forumInfoObject = {
      description: this.props.form.createForum.values.forumDescription,
      rules: this.props.form.createForum.values.forumRules
    };
    const forumInfoIpfsHash = await services.ipfs.uploadObject(forumInfoObject);
    const bs58 = require('bs58');
    const forumInfoBytes32 =
      '0x' +
      bs58
        .decode(forumInfoIpfsHash)
        .slice(2)
        .toString('hex');
    this.createForum({
      forumInfo: forumInfoBytes32
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
            instance.createForum
              .sendTransaction(
                this.props.web3.utils.fromAscii(this.props.username),
                this.props.form.createForum.values.forumName,
                props.forumInfo,
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
