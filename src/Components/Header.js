import React, { Component } from 'react'

export default class Header extends Component {
	render() {
		return (
			<div>
				    <p>Metamask address = {this.props.accounts.currentOwnerAddress}</p>
            <p>User address = {this.props.accounts.currentUserAddress}</p>
            <p>Current forum = {this.props.currentForum}</p>
            <p>Current forum address = {this.props.currentForumAddress}</p>
			</div>
		)
	}
}
