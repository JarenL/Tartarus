import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserContract from '../../contracts/User.json';
import CommentList from '../Comment/CommentList';
import Loading from '../Loading.js';

class CommentTabContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comments: [],
      loading: true
    }
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const user = contract(UserContract)
    user.setProvider(this.props.web3.currentProvider)
    user.at(this.props.accounts.currentUserAddress).then((instance) => {
      instance.CommentCreated({}, { fromBlock: 0, toBlock: 'latest' }).get((error, result) => {
        let newCommentArray = this.state.comments.slice();
        result.forEach((comment) => {
          newCommentArray.push({
            address: comment.args.commentAddress,
          });
        })
        this.setState({
					comments: newCommentArray,
					loading: false
        });
      });
    })
  }

  render() {
		console.log(this.state.comments)
		if (this.state.loading) {
			return <Loading/>
		} else {
			return (
				<div>
					<CommentList comments={this.state.comments} />
				</div>
			)
		}
  }
}

const mapStateToProps = (state) => {
  return {
    web3: state.web3,
    accounts: state.accounts
  };
}

export default connect(mapStateToProps)(CommentTabContainer);
