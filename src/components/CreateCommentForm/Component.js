import React from 'react';
import styled from 'styled-components/macro';
import Form from '../shared/form/Form';
import { transition } from '../shared/helpers';
import CommentFormTextArea from './TextArea';
import CommentFormSubmitButton from './SubmitButton';
import TartarusContract from '../../contracts/Tartarus.json';
import UserContract from '../../contracts/User.json';
import CommentFormCommentButton from './CommentButton';
import CancelButton from './CancelButton';

const services = require('../../services');

const StyledForm = styled(Form)`
  ${transition('border', 'box-shadow')};
  margin-top: -1px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 0 0 2px 2px;
  max-width: none;
  padding: 0;
  @media (hover: hover) {
    :hover {
      border: 1px solid ${props => props.theme.accent};
    }
  }
  :focus-within {
    border: 1px solid ${props => props.theme.accent};
    box-shadow: 0 0 0 2px ${props => props.theme.accent + '4d'};
  }
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
          <CommentFormTextArea name='comment' />
          <Wrapper>
            <CommentFormSubmitButton onClick={this.handleSubmit} />
            <CancelButton onClick={this.handleCancel} />
          </Wrapper>
        </StyledForm>
      );
    } else {
      return (
        <StyledForm>
          <CommentFormCommentButton onClick={this.handleComment} />
        </StyledForm>
      );
    }
  }
}

export default CommentForm;
