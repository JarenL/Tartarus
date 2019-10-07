import React from 'react';
import { Field } from 'redux-form';
import Form from '../shared/form/Form';
import renderField from '../shared/form/renderField';
import styled from 'styled-components/macro';
import TartarusContract from '../../contracts/Tartarus.json';
import CancelButton from '../Buttons/CancelButton';
import SubmitButton from '../Buttons/SubmitButton';
import {
  uploadToast,
  warningToast,
  errorToast,
  confirmToast,
  dismissToast
} from '../Notifications/Toasts/Toast';
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

  componentWillUnmount = () => {
    dismissToast();
  }

  handleSubmit = async () => {
    this.setState({
      loading: true
    });
    uploadToast();
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
    warningToast();
    this.createForum({
      forumInfo: forumInfoBytes32
    });
  };

  handleCancel = () => {
    this.props.reset('createForum');
    this.props.history.goBack();
    // errorToast();
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
          instance.createUserCost.call().then(async createForumCost => {
            console.log(createForumCost.toString());
            // let createForumGas = await instance.createForum.estimateGas(
            //   this.props.web3.utils.fromAscii(this.props.username),
            //   this.props.form.createForum.values.forumName,
            //   props.forumInfo,
            //   {
            //     from: accounts[0],
            //     gasPrice: 20000000000,
            //     value: createForumCost.toString()
            //   }
            // );
            // console.log('create forum gas - ' + createForumGas.toString());
            // let gasPrice = await this.props.web3.eth.getGasPrice();
            // let createForumTest = createForumGas * gasPrice;
            // console.log(
            //   'create forum eth cost - ' +
            //     this.props.web3.utils.fromWei(
            //       createForumTest.toString(),
            //       'ether'
            //     )
            // );
            instance.createForum
              .sendTransaction(
                this.props.web3.utils.fromAscii(this.props.username),
                this.props.form.createForum.values.forumName,
                props.forumInfo,
                {
                  from: accounts[0],
                  gasPrice: 20000000000,
                  value: (createForumCost * 10).toString()
                }
              )
              .then(result => {
                this.props.reset('createForum');
                confirmToast();
                this.setState({
                  loading: false
                });
              })
              .catch(error => {
                console.log('error');
                errorToast();
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
