import React, { Component } from 'react'
import Header from './Headers/Header'
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux'

class FrontPage extends Component {
	render() {
		if (this.props.currentForumAddress === null) {
			return (
					<div>
						<Header
							currentOwnerAddress={this.props.accounts.currentOwnerAddress}
							currentUserAddress={this.props.accounts.currentUserAddress}
							currentForum={this.props.currentForum}
							currentForumAddress={this.props.currentForumAddress}
						/>
						<Divider />
					</div>
			)
		}
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

export default connect(mapStateToProps)(FrontPage);