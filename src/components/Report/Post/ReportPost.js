import React from 'react';
import { Field } from 'redux-form';
import Form from '../../shared/form/Form';
import renderField from '../../shared/form/renderField';
import styled from 'styled-components/macro';
import PostContainer from '../../Post/Post/Container';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner';
import Empty from '../../shared/Empty';
import { withRouter } from 'react-router-dom';
import SubmitButton from '../../Buttons/SubmitButton';
import CancelButton from '../../Buttons/CancelButton';
import { uploadToast, warningToast, confirmToast, errorToast } from '../../Notifications/Toasts/Toast';

const PostWrapper = styled.div`
  border: 1px solid ${props => props.theme.error};
  width: 100%;
  margin-bottom: 8px;
  margin: 6px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
`;

const services = require('../../../services');

class ReportForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      reportLoading: false,
      post: null,
      exists: true,
      showCommentForm: false
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  componentWillUnmount = () => {
    this.props.reset('report');
  };

  instantiateContract() {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance
          .PostCreated(
            {
              postId: this.props.postId
            },
            {
              fromBlock: 0,
              toBlock: 'latest'
            }
          )
          .get((error, post) => {
            console.log(post);
            if (
              post.length === 0 ||
              post[0].args.creator ===
                '0x0000000000000000000000000000000000000000000000000000000000000000'
            ) {
              this.setState({
                exists: false,
                loading: false
              });
            } else {
              instance
                .CommentCreated(
                  {
                    postId: this.props.postId
                  },
                  {
                    fromBlock: 0,
                    toBlock: 'latest'
                  }
                )
                .get((error, comments) => {
                  this.setState({
                    comments: comments,
                    post: post[0],
                    loading: false
                  });
                  console.log(comments);
                });
            }
          });
      });
    });
  }

  handleCancel = () => {
    this.props.reset('report');
    this.props.history.goBack();
  };

  handleReport = async () => {
    console.log(this.props.form.report.values);
    this.setState({
      reportLoading: true
    });
    if (this.props.form.report.values.reason !== undefined) {
      uploadToast();
      let reportObject = {
        reason: this.props.form.report.values.reason
      };
      const reportIpfsHash = await services.ipfs.uploadObject(reportObject);
      const bs58 = require('bs58');
      const reportBytes32 =
        '0x' +
        bs58
          .decode(reportIpfsHash)
          .slice(2)
          .toString('hex');
      this.submitReportTransaction({ reportBytes32 });
    } else {
      this.setState({
        reportLoading: false
      });
    }
  };

  submitReportTransaction = props => {
    console.log(this.props);
    warningToast();
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.reportPost
          .sendTransaction(
            this.props.web3.utils.fromAscii(this.props.username),
            this.props.web3.utils.fromAscii(this.props.forumName),
            this.props.postId,
            props.reportBytes32,
            {
              from: accounts[0],
              gasPrice: 20000000000
            }
          )
          .then(result => {
            console.log(result);
            this.setState({
              loading: false,
              reportLoading: false
            });
            confirmToast();
            this.props.reset('report');
          })
          .catch(error => {
            console.log('error');
            this.setState({
              loading: false,
              reportLoading: false
            });
            errorToast();
          });
      });
    });
  };

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.exists) return <Empty />;
    return (
      <Form
        loading={this.state.reportLoading}
        onSubmit={this.props.handleSubmit(this.handleReport)}
        wide
      >
        {this.state.exists ? (
          <>
            <PostWrapper>
              <PostContainer post={this.state.post.args} showFullPost={false} />
            </PostWrapper>
            <Field
              name='reason'
              label='Report Reason'
              type='textarea'
              component={renderField}
              validate={this.props.reportPostValidator}
            />
            <ButtonWrapper>
              <SubmitButton />
              <CancelButton onClick={this.handleCancel} />
            </ButtonWrapper>
          </>
        ) : (
          <Empty />
        )}
      </Form>
    );
  }
}

export default withRouter(ReportForm);
