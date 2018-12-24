import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from '../Loading.js';
import SubscriptionList from '../Subscriptions/SubscriptionList.js';

class SubscriptionTabContainer extends Component {
	render() {
		if (this.state.loading) {
			return <Loading />
		} else {
			if (this.props.forumSubscriptions) {
				return (
					<div>
						<SubscriptionList subscriptions={this.props.forumSubscriptions} />
					</div>
				)
			} else {
				return (
					<div>No subscriptions</div>
				)
			}
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
