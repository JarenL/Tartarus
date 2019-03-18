import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import CommentForm from './Component';
import TartarusContract from '../../contracts/Tartarus.json';
import { withRouter } from "react-router";

const services = require('../../services');

class CommentFormContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: '',
      errorMessage: null,
      submitting: false
    };
  }

  handleCommentChange = value => {
    this.setState({ comment: value });
    console.log(this.state.comment)
  };

  handleSubmit = async () => {
    if (this.props.currentUserAddress === 0) {
      this.props.history.push('/login');
    }
    console.log("comment submit")
    this.setState({ errorMessage: null });
    if (this.state.comment) {
      this.setState({ submitting: true });
      let commentObject = { comment: this.state.comment };
      console.log(commentObject);
      const ipfsHash = await services.ipfs.uploadObject(commentObject);
      console.log(ipfsHash);

      //encode ipfs Hash base 58 -> hex address base 32
      const bs58 = require('bs58');
      const base58 =
        '0x' +
        bs58
          .decode(ipfsHash)
          .slice(2)
          .toString('hex');
      this.submitCommentTransaction(base58);
    }

    // else {
    //   this.setState({
    //     errorMessage: (
    //       <Typography variant='body1'>Cannot submit empty comments.</Typography>
    //     )
    //   });
  };

  submitCommentTransaction = ipfsHash => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.createComment(
          this.props.forumAddress,
          this.props.postAddress,
          this.props.postAddress,
          ipfsHash,
          { from: accounts[0], gasPrice: 20000000000 }
        );
      });
    });
  };
  render() {
    return (
      <CommentForm
        handleCommentChange={this.handleCommentChange.bind(this)}
        handleSubmit={this.handleSubmit.bind(this)}
      />
    );
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress,
  accounts: state.accounts,
  currentUserAddress: state.accounts.currentUserAddress
});

export default withRouter(connect(mapStateToProps)(CommentFormContainer));

