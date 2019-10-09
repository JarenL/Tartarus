import React from 'react';
import { Field } from 'redux-form';
import Form from '../../shared/form/Form';
import renderField from '../../shared/form/renderField';
import styled from 'styled-components/macro';
import PostContainer from '../../Post/Post/Container';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner';
import Empty from '../../shared/Empty';
import CommentContainer from '../../Comment/Comment/Container';
import { withRouter } from 'react-router-dom';
import SubmitButton from '../../Buttons/SubmitButton';
import CancelButton from '../../Buttons/CancelButton';

const PostWrapper = styled.div`
  border: 1px solid ${props => props.theme.border};
  width: 100%;
  margin-bottom: 8px;
`;

const CommentWrapper = styled.div`
  border: 1px solid ${props => props.theme.error};
  margin-bottom: 8px;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
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

  componentWillUnmount = () => {
    this.props.reset('report');
  };

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
                    console.log(comment);
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

  handleCancel = () => {
    this.props.reset('report');
    this.props.history.goBack();
  };

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
      <Form
        loading={this.state.reportLoading}
        onSubmit={this.props.handleSubmit(this.handleReport)}
        wide
      >
        {this.state.postExists ? (
          <PostWrapper>
            <PostContainer post={this.state.post.args} showFullPost={false} />
          </PostWrapper>
        ) : (
          <Empty />
        )}
        {this.state.commentExists ? (
          <CommentWrapper>
            <CommentContainer comment={this.state.comment} />
          </CommentWrapper>
        ) : (
          <Empty />
        )}
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
      </Form>
    );
  }
}

export default withRouter(ReportComment);
