import React from 'react';
import { Field } from 'redux-form';
import Form from '../../shared/form/Form';
import renderField from '../../shared/form/renderField';
import SubmitButton from '../../shared/form/SubmitButton';
import CancelButton from '../../shared/form/CancelButton';
import styled from 'styled-components/macro';
import PostContainer from '../../Post/PostContainer';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner';
import Empty from '../../shared/Empty';
import CommentContainer from '../../Comment/Container';
import CommentList from '../../CommentList';

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

const CommentWrapper = styled.div`
  border: 1px solid ${props => props.theme.error};
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
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

const services = require('../../../services');

class ReportComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      reportLoading: false,
      post: null,
      comment: null,
      postExists: true,
      commentExists: true,
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
        console.log(this.props);
        instance
          .PostCreated(
            {
              forum: this.props.web3.utils.fromAscii(this.props.forumName),
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
              post[0].args.creator ===
              '0x0000000000000000000000000000000000000000000000000000000000000000'
            ) {
              this.setState({
                postExists: false,
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
                  const comment =
                    comments[
                      comments
                        .map(function(e) {
                          return e.args.commentId;
                        })
                        .indexOf(this.props.commentId)
                    ];
                  if (comment === undefined) {
                    this.setState({
                      commentExists: false,
                      loading: false
                    });
                  } else {
                    this.setState({
                      post: post[0],
                      comment: comment,
                      loading: false
                    });
                    console.log(post[0].args);
                    console.log(comment.args);
                  }
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
    console.log('upload');
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
    console.log(props);
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.reportComment
          .sendTransaction(
            this.props.web3.utils.fromAscii(this.props.username),
            this.props.web3.utils.fromAscii(this.props.forumName),
            this.props.postId,
            this.props.commentId,
            props.reportBytes32,
            {
              from: accounts[0],
              gasPrice: 20000000000
            }
          )
          .then(result => {
            console.log(result);
            this.setState({
              reportLoading: false
            });
            this.props.reset('report');
          })
          .catch(error => {
            console.log('error');
            this.setState({
              reportLoading: false
            });
          });
      });
    });
  };

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    return (
      <Wrapper>
        {this.state.postExists ? (
          <PostContainer post={this.state.post.args} showFullPost={true} />
        ) : (
          <Empty />
        )}
        <Space />
        {this.state.commentExists ? (
          <CommentWrapper>
            <CommentList
              forumName={this.props.forumName}
              comments={[this.state.comment]}
            />
          </CommentWrapper>
        ) : (
          <Empty />
        )}
        <Space />
        {this.state.commentExists ? (
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

export default ReportComment;
