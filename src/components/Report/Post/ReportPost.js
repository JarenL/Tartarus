import React from 'react';
import { Field } from 'redux-form';
import Form from '../../shared/form/Form';
import renderField from '../../shared/form/renderField';
import SubmitButton from '../../shared/form/SubmitButton';
import CancelButton from '../../shared/form/CancelButton';
import styled from 'styled-components/macro';
import PostContainer from '../../Post/Post/Container';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner';
import Empty from '../../shared/Empty';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  width: 100%;
  background-color: ${props => props.theme.foreground};
`;

const Space = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: 10px;
  background-color: ${props => props.theme.pageBackground};
`;

const PostWrapper = styled.div`
  border: 1px solid ${props => props.theme.error};
`;

const StyledForm = styled(Form)`
  margin-top: 6px;
  padding: 4px;
  width: 100%;
  border-bottom: none;
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
            if (
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

  handleReport = async () => {
    console.log(this.props.form.report.values);
    this.setState({
      reportLoading: true
    });
    if (this.props.form.report.values.reason !== undefined) {
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
              loading: false
            });
            this.props.reset('report');
          })
          .catch(error => {
            console.log('error');
            this.setState({
              loading: false
            });
          });
      });
    });
  };

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.exists) return <Empty />;
    return (
      <Wrapper>
        {this.state.exists ? (
          <PostWrapper>
            <PostContainer post={this.state.post.args} showFullPost={true} />
          </PostWrapper>
        ) : (
          <Empty />
        )}
        <Space />
        {this.state.exists ? (
          <StyledForm
            loading={this.state.reportLoading}
            onSubmit={this.props.handleSubmit(this.handleReport)}
            wide
          >
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
          </StyledForm>
        ) : null}
      </Wrapper>
    );
  }
}

export default ReportForm;
