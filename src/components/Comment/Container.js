import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';
import CommentContent from './Content';
import CommentContract from '../../contracts/Comment.json';
import ipfs from '../../services/ipfs/ipfs';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';
import CommentDetail from './Detail/Component';

const Wrapper = styled.div`
  border: 1px solid ${props => props.theme.border};
  border-radius: 2px;
  background-color: ${props => props.theme.foreground};

  @media (max-width: 768px) {
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
`;

class CommentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: null,
      username: null,
      post: null,
      forum: null,
      target: null,
      time: null,
      commentReplies: null,
      loading: true,
      exists: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract() {
    const contract = require('truffle-contract');
    const comment = contract(CommentContract);
    comment.setProvider(this.props.web3.currentProvider);
    comment.at(this.props.commentAddress).then(instance => {
      instance.commentInfo.call().then(result => {
        const bs58 = require('bs58');
        const hashHex = '1220' + result[0].slice(2);
        const hashBytes = Buffer.from(hashHex, 'hex');
        const ipfsHash = bs58.encode(hashBytes);
        ipfs.catJSON(ipfsHash, (err, ipfsData) => {
          if (ipfsData) {
            this.setState({
              comment: ipfsData.comment,
              // commentReplies: commentReplies.length,
              username: result[1],
              // target: result[2],
              votes: result[4].c[0],
              // post: this.props.currentPostAddress,
              time: result[3].c[0] * 1000,
              loading: false
            });
          } else {
            this.setState({
              exists: false
            });
          }
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      if (this.state.exists) {
        return <LoadingIndicatorSpinner />;
      } else {
        return null;
      }
    } else {
      return (
        <Wrapper>
          <CommentDetail
            username={this.state.username}
            time={this.state.time}
          />
          <CommentContent comment={this.state.comment}/>
        </Wrapper>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3
  };
}

export default connect(mapStateToProps)(CommentContainer);
