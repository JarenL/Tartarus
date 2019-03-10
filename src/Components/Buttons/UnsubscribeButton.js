import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import MinusIcon from '@material-ui/icons/RemoveCircleOutlined';
import { connect } from 'react-redux';
import {
	updateForumSubscriptions, updateUserSubscriptions
} from '../../redux/actions/actions'

const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	}
});

class UnsubscribeButton extends Component {
	unsubscribeHandler = (forumContext) => {
		let newSubscriptionsArray = this.props.userSettings[this.props.currentUserAddress].subscriptions.slice();
		for (var i = 0; i < newSubscriptionsArray.length; i++) {
			if (newSubscriptionsArray[i].address === forumContext) {
				newSubscriptionsArray.splice(i, 1)
			}
		}
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
				<Button onClick={() => this.unsubscribeHandler(this.props.forumContext)} variant="contained" color="secondary" className={classes.button}>
					Unsubscribe
					<MinusIcon className={classes.rightIcon} />
				</Button>
			</div>
		);
	}

}

UnsubscribeButton.propTypes = {
	classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
	return {
		userSettings: state.accounts.userSettings,
		currentUserAddress : state.accounts.currentUserAddress
	};
}

export default connect(mapStateToProps)(withStyles(styles)(UnsubscribeButton));