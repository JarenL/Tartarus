import React from 'react';
import styled from 'styled-components/macro';
import Form from '../shared/form/Form';
import { transition } from '../shared/helpers';
import TartarusContract from '../../contracts/Tartarus.json';
import Editor from '../shared/form/Editor';
import { Field } from 'redux-form';
import SubmitButton from '../Buttons/SubmitButton';
import CommentButton from '../Buttons/CommentButton';
import CancelButton from '../Buttons/CancelButton';
import { uploadToast, confirmToast, errorToast, warningToast } from '../Notifications/Toasts/Toast';

const services = require('../../services');

const StyledForm = styled(Form)`
  // ${transition('border', 'box-shadow')};
  margin-top: -1px;
  // border: 1px solid ${props => props.theme.border};
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
  border: none;
  background-color: ${props => props.theme.pageBackground};
  width: 100%;
`;

class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  handleSubmit = async () => {
    console.log(this.props);
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      if (this.props.form.createCommentReply.values !== undefined) {
        uploadToast();
        this.setState({ loading: true });
        let commentObject = {
          comment: this.props.form.createCommentReply.values.comment
        };
        console.log(commentObject);
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

  handleCancel = () => {
    this.props.reset('createCommentReply');
    this.props.handleReply();
  };

  submitCommentTransaction = ipfsHash => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.createCommentCost.call().then(createCommentCost => {
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
              this.props.reset('createCommentReply');
              confirmToast();
              this.props.handleReply();
              this.setState({
                loading: false
              });
            })
            .catch(error => {
              console.log('createCommentReplyForm error');
              console.log(error);
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
    return (
      <StyledForm
        onSubmit={this.props.handleSubmit(this.handleSubmit)}
        loading={this.state.loading}
      >
        <Field name='comment' placeholder={"test"} component={Editor} />
        <Wrapper>
          <SubmitButton />
          <CancelButton onClick={this.handleCancel} />
        </Wrapper>
      </StyledForm>
    );
  }
}

export default CommentForm;
