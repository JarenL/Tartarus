import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import PostListContainer from '../Containers/PostListContainer'
import Header from './Header'
import Divider from '@material-ui/core/Divider';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { connect } from 'react-redux'


class ForumPage extends Component {
	constructor(match) {
		super(match)
		console.log(match.match.params)
    this.state = {
      forumAddress: match.match.params.forumAddress
    }
  }
	render() {
		return (
			<div>
				<Header
					currentOwnerAddress={this.props.accounts.currentOwnerAddress}
					currentUserAddress={this.props.accounts.currentUserAddress}
					currentForum={this.props.currentForum}
					currentForumAddress={this.props.currentForumAddress}
				/>
				<Divider />
				<PostListContainer forumAddress={this.state.forumAddress}/>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		web3: state.web3,
		tartarusAddress: state.tartarus.tartarusAddress,
		accounts: state.accounts,
		currentForum: state.forum.currentForum,
		currentForumAddress: state.forum.currentForumAddress
	};
}

export default connect(mapStateToProps)(ForumPage);