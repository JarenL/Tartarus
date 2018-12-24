import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from '../Loading.js';
import SubscriptionList from '../Subscriptions/SubscriptionList.js';

class SubscriptionTabContainer extends Component {
	render() {
		console.log(this.props.forumSubscriptions)
		if (this.props.forumSubscriptions === undefined || this.props.forumSubscriptions.length === 0) {
			return (
				<div>No subscriptions</div>
			)
		} else {
			
			return (
				<div>
					<SubscriptionList subscriptions={this.props.forumSubscriptions} />
				</div>
			)
		}
	}
}

const mapStateToProps = (state) => {
	return {
		web3: state.web3,
		accounts: state.accounts,
		forumSubscriptions: state.forum.forumSubscriptions
	};
}

export default connect(mapStateToProps)(SubscriptionTabContainer);
