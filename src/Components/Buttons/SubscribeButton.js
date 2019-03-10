import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/AddCircleOutlined';
import { connect } from 'react-redux';
import {
	updateForumSubscriptions, 
	updateUserSubscriptions
} from '../../redux/actions/actions'

const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	}
});

class SubscribeButton extends Component {
	subscribeHandlder = (forumContext) => {
		let newSubscriptionsArray = this.props.userSettings[this.props.currentUserAddress].subscriptions.slice();
		newSubscriptionsArray.push({
			address : forumContext
		});

		let payload = {
			user : this.props.currentUserAddress,
			subscriptions : newSubscriptionsArray
		}
		// this.props.dispatch(updateForumSubscriptions(newSubscriptionsArray))
		this.props.dispatch(updateUserSubscriptions(payload))
	}

	render() {
		const { classes } = this.props;
		return (
			<div>
				<Button onClick={() => this.subscribeHandlder(this.props.forumContext)} variant="contained" color="secondary" className={classes.button}>
					Subscribe
					<AddIcon className={classes.rightIcon} />
				</Button>
			</div>
		);
	}

}

SubscribeButton.propTypes = {
	classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
	return {
		userSettings: state.accounts.userSettings,
		currentUserAddress : state.accounts.currentUserAddress
	};
}

export default connect(mapStateToProps)(withStyles(styles)(SubscribeButton));