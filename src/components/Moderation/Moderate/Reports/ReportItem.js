import React from 'react';
import styled from 'styled-components/macro';
import UpButton from '../../../Buttons/UpButton';
import DownButton from '../../../Buttons/DownButton';
import { Link } from 'react-router-dom';
import Empty from '../../../shared/Empty';
import moment from 'moment';
import TartarusContract from '../../../../contracts/Tartarus.json';
import PostContainer from '../../../Post/Post/Container';
import CommentContainer from '../../../Comment/Comment/Container';
import LoadingIndicatorSpinner from '../../../shared/LoadingIndicator/Spinner';
import BanButton from '../../../Buttons/Ban';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  // border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.foreground};
  // margin-top: 12px;
`;

const ReportWrapper = styled.div`
  overflow-wrap: break-word;
  display: flex;
  border-left: none;
  padding: 8px;
  font-size: 12px;
  list-style-position: inside;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.normalText};
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  font-size: 15px;
  color: ${props => props.theme.accent};
  &:hover {
    color: ${props => props.theme.accent};
    & > svg {
      color: ${props => props.theme.accent} !important;
    }
  }
`;

const ButtonWrapper = styled.div`
  align-self: flex-end;
  justify-content: center;
  color: ${props => props.theme.mutedText};
`;

const PostWrapper = styled.div`
  border: 1px solid ${props => props.theme.error};
  width: 100%;
  // margin-bottom: 8px;
  // margin: 6px;
`;

const CommentWrapper = styled.div`
  border: 1px solid ${props => props.theme.error};
  // margin-bottom: 8px;
  width: 100%;
`;

class ReportItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
      post: null,
      comment: null,
      commentExists: true,
      postExists: true,
      exists: true,
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  toggleShowDetails = () => {
    this.setState({
      showDetails: !this.state.showDetails
    });
  };

  handleBan = () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.event.address).then(instance => {
        console.log(this.state);
        console.log(this.props);
        instance.moderatorBan
          .sendTransaction(
            this.props.web3.utils.fromAscii(this.props.username),
            this.state.comment === null
              ? this.state.post.args.creator
              : this.state.comment.args.creator,
            this.state.comment === null
              ? this.props.event.args._forum
              : this.props.event.args._forum,
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

  instantiateContract() {
    if (this.props.event.event === 'ReportPost') {
      const contract = require('truffle-contract');
      const tartarus = contract(TartarusContract);
      tartarus.setProvider(this.props.web3.currentProvider);
      tartarus.at(this.props.event.address).then(instance => {
        instance
          .PostCreated(
            {
              postId: this.props.event.args.postId
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
                    postId: this.props.event.args.postId
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
    } else {
      const contract = require('truffle-contract');
      const tartarus = contract(TartarusContract);
      tartarus.setProvider(this.props.web3.currentProvider);
      this.props.web3.eth.getAccounts((error, accounts) => {
        tartarus.at(this.props.event.address).then(instance => {
          console.log(this.props);
          instance
            .PostCreated(
              {
                forum: this.props.event.args._forum,
                postId: this.props.event.args.postId
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
                      postId: this.props.event.args.postId
                    },
                    {
                      fromBlock: 0,
                      toBlock: 'latest'
                    }
                  )
                  .get((error, comments) => {
                    console.log(comments);
                    const comment =
                      comments[
                        comments
                          .map(function(e) {
                            return e.args.commentId;
                          })
                          .indexOf(this.props.event.args.commentId)
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
                    }
                  });
              }
            });
        });
      });
    }
  }

  render() {
    console.log(this.props);
    console.log(this.state);
    return (
      <Wrapper>
        <ReportWrapper>
          <div>
            <StyledLink
              to={`/f/${this.props.web3.utils.toAscii(
                this.props.event.args._forum
              )}/p/${this.props.event.args.postId}`}
            >
              {this.props.event.event === 'ReportPost' ? 'Post' : 'Comment'}
            </StyledLink>{' '}
            {' reported '}
            {` ${moment(this.props.event.args.time.c[0] * 1000).fromNow()}`}
          </div>
          {this.state.showDetails ? (
            <ButtonWrapper>
              <BanButton size={18} onClick={() => this.handleBan()} />
              <UpButton size={18} onClick={() => this.toggleShowDetails()} />
            </ButtonWrapper>
          ) : (
            <ButtonWrapper>
              <DownButton size={18} onClick={() => this.toggleShowDetails()} />
            </ButtonWrapper>
          )}
        </ReportWrapper>
        {this.state.showDetails ? (
          this.props.event.event === 'ReportPost' ? (
            <PostWrapper>
              <PostContainer post={this.state.post.args} showFullPost={false} />
            </PostWrapper>
          ) : this.state.loading ? (
            <LoadingIndicatorSpinner />
          ) : true ? (
            <CommentWrapper>
              <CommentContainer comment={this.state.comment} disabled={true} />
            </CommentWrapper>
          ) : (
            <Empty />
          )
        ) : null}
      </Wrapper>
    );
  }
}

export default ReportItem;
