import React, { Component } from 'react';
import ReactList from 'react-list';
import CommentListItem from './Item';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../shared/LoadingIndicator/Spinner';
import { updateUserPermissions } from '../../../redux/actions/actions';
import Empty from '../../shared/Empty';

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      loading: true,
      currentComment: null
    };
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  instantiateContract = () => {
    const contract = require('truffle-contract');
    console.log(this.props)
    if (this.props.postId === undefined) {
      if (this.props.user === undefined) {
        //comment page
        console.log('comment');
        const tartarus = contract(TartarusContract);
        tartarus.setProvider(this.props.web3.currentProvider);
        tartarus
          .at(this.props.tartarusAddress)
          .then(instance => {
            instance
              .CommentCreated(
                { postId: this.props.postId },
                { fromBlock: 0, toBlock: 'latest' }
              )
              .get((error, comments) => {
                this.setState({
                  comments: comments,
                  loading: false
                });
                console.log(comments);
              });
          })
          .catch(err => {
            console.log('error');
          });
      } else {
        // user page
        console.log('user');
        const tartarus = contract(TartarusContract);
        tartarus.setProvider(this.props.web3.currentProvider);
        tartarus
          .at(this.props.tartarusAddress)
          .then(instance => {
            instance
              .CommentCreated(
                {
                  creator: this.props.web3.utils.fromAscii(this.props.user)
                },
                {
                  fromBlock: 0,
                  toBlock: 'latest'
                }
              )
              .get((error, comments) => {
                this.setState({
                  comments: comments,
                  loading: false
                });
                console.log(comments);
              });
          })
          .catch(err => {
            console.log('error');
          });
      }
    } else {
      //post page
      const tartarus = contract(TartarusContract);
      tartarus.setProvider(this.props.web3.currentProvider);
      tartarus
        .at(this.props.tartarusAddress)
        .then(instance => {
          console.log(this.props.forumName);
          console.log(this.props.username);
          instance.getModerator
            .call(
              this.props.web3.utils.fromAscii(this.props.username),
              this.props.web3.utils.fromAscii(this.props.forumName)
            )
            .then(moderator => {
              console.log(moderator);
              let permissionsObject = {
                type: 'moderator',
                permissions: moderator
              };
              this.props.dispatch(updateUserPermissions(permissionsObject));
            });
          instance
            .CommentCreated(
              {
                postId: this.props.postId
              },
              { fromBlock: 0, toBlock: 'latest' }
            )
            .get((error, comments) => {
              console.log(comments);
              this.setState({
                comments: comments,
                loading: false
              });
            });
        })
        .catch(err => {
          console.log('error');
        });
    }
  };

  handleReply = props => {
    if (props === this.state.currentComment) {
      this.setState({
        currentComment: null
      });
    } else {
      this.setState({
        currentComment: props
      });
    }
  };

  renderItem(index, key) {
    console.log(this.state.comments);
    return (
      <CommentListItem
        key={key}
        forumName={this.props.forumName}
        comment={this.state.comments[index].args}
        currentComment={this.state.currentComment}
        handleReply={this.handleReply}
      />
    );
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.comments || this.state.comments.length === 0) return <Empty />;
    return (
      <ReactList
        itemRenderer={this.renderItem.bind(this)}
        length={this.state.comments.length}
        type='simple'
      />
    );
  }
}

export default CommentList;
