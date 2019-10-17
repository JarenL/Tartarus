import React from 'react';
import styled from 'styled-components/macro';
import Form from '../shared/form/Form';
import TartarusContract from '../../contracts/Tartarus.json';
import Editor from '../shared/form/Editor';
import { Field } from 'redux-form';
import CancelButton from '../Buttons/CancelButton';
import SubmitButton from '../Buttons/SubmitButton';
import CommentButton from '../Buttons/CommentButton';
import {
  uploadToast,
  confirmToast,
  warningToast,
  errorToast,
  dismissToast
} from '../Notifications/Toasts/Toast';

const services = require('../../services');

const StyledForm = styled(Form)`
  margin-top: -1px;
  max-width: none;
  padding: 0;
  border-bottom: none;
  background-color: ${props => props.theme.pageBackground};
  @media (max-width: 768px) {
    margin-top: -1px;
    border-radius: 0;
    border-left: none;
    border-right: none;
    :hover,
    :focus-within {
      border-left: none;
      border-right: none;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.pageBackground};
`;

class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      commenting: false
    };
  }

  componentWillUnmount = () => {
    dismissToast();
  }

  handleComment = () => {
    this.setState({
      commenting: true
    });
  };

  handleCancel = () => {
    this.props.reset('createComment');
    this.setState({
      commenting: false
    });
  };

  handleSubmit = async () => {
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      if (this.props.form.createComment.values !== undefined) {
        this.setState({ loading: true });
        let commentObject = {
          comment: this.props.form.createComment.values.comment
        };
        console.log(commentObject);
        uploadToast();
        const ipfsHash = await services.ipfs.uploadObject(commentObject);
        const bs58 = require('bs58');
        const base58 =
          '0x' +
          bs58
            .decode(ipfsHash)
            .slice(2)
            .toString('hex');
        warningToast();
        this.submitCommentTransaction(base58);
      }
    }
  };

  submitCommentTransaction = ipfsHash => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.createCommentCost.call().then(async createCommentCost => {
          console.log(this.props);
          let createCommentGas = await instance.createComment.estimateGas(
            this.props.web3.utils.fromAscii(this.props.username),
            this.props.web3.utils.fromAscii(this.props.forumName),
            this.props.postId,
            ipfsHash,
            this.props.targetId,
            {
              from: accounts[0],
              gasPrice: 20000000000,
              value: createCommentCost
            }
          );
          console.log('create comment gas - ' + createCommentGas.toString());
          let gasPrice = await this.props.web3.eth.getGasPrice();
          let commentTest = createCommentGas * gasPrice;
          console.log(
            'create comment eth cost - ' +
              this.props.web3.utils.fromWei(commentTest.toString(), 'ether')
          );
          instance.createComment
            .sendTransaction(
              this.props.web3.utils.fromAscii(this.props.username),
              this.props.web3.utils.fromAscii(this.props.forumName),
              this.props.postId,
              ipfsHash,
              this.props.targetId,
              {
                from: accounts[0],
                gasPrice: 20000000000,
                value: createCommentCost
              }
            )
            .then(result => {
              this.props.reset('createComment');
              confirmToast();
              this.setState({
                loading: false,
                commenting: false
              });
            })
            .catch(err => {
              console.log(err);
              errorToast();
              this.setState({
                loading: false
              });
            });
        });
      });
    });
  };

  render() {
    if (this.state.commenting) {
      return (
        <StyledForm
          onSubmit={this.props.handleSubmit(this.handleSubmit)}
          loading={this.state.loading}
        >
          <Field name='comment' component={Editor} />
          <Wrapper>
            <SubmitButton />
            <CancelButton onClick={this.handleCancel} />
          </Wrapper>
        </StyledForm>
      );
    } else {
      return (
        <StyledForm>
          <CommentButton onClick={this.handleComment} />
        </StyledForm>
      );
    }
  }
}

export default CommentForm;
