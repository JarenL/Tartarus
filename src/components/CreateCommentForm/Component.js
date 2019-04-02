import React from 'react';
import styled from 'styled-components/macro';
import Form from '../shared/form/Form';
import { transition } from '../shared/helpers';
import UserContract from '../../contracts/User.json';
import Editor from '../shared/form/Editor';
import { Field } from 'redux-form';
import CommentButton from '../shared/form/CommentButton';
import CancelButton from '../shared/form/CancelButton';

const services = require('../../services');

const StyledForm = styled(Form)`
  ${transition('border', 'box-shadow')};
  margin-top: -1px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 0 0 2px 2px;
  max-width: none;
  padding: 0;
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
`;

class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  handleComment = () => {
    this.setState({
      commenting: true
    });
  };

  handleCancel = () => {
    this.setState({
      commenting: false
    });
  };

  handleSubmit = async () => {
    console.log(this.props);
    if (this.props.userAddress === null) {
      this.props.history.push('/login');
    } else {
      if (this.props.form.comment.values !== undefined) {
        this.setState({ loading: true });
        let commentObject = { comment: this.props.form.comment.values };
        const ipfsHash = await services.ipfs.uploadObject(commentObject);
        const bs58 = require('bs58');
        const base58 =
          '0x' +
          bs58
            .decode(ipfsHash)
            .slice(2)
            .toString('hex');
        this.submitCommentTransaction(base58);
      }
    }
  };

  submitCommentTransaction = ipfsHash => {
    const contract = require('truffle-contract');
    const user = contract(UserContract);
    user.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      user.at(this.props.userAddress).then(instance => {
        instance
          .createComment(
            this.props.forumAddress,
            this.props.postAddress,
            this.props.postAddress,
            ipfsHash,
            { from: accounts[0], gasPrice: 20000000000 }
          )
          .then(result => {
            this.setState({
              loading: false
            });
          })
          .catch(function(e) {
            console.log('error');
            this.setState({
              loading: false
            });
          });
      });
    });
  };

  render() {
    if (this.state.commenting) {
      return (
        <StyledForm loading={this.state.loading}>
          <Field name={this.props.name} component={Editor} />
          <Wrapper>
            <CommentButton onClick={this.handleSubmit} />
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
