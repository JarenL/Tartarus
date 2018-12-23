import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import MinusIcon from '@material-ui/icons/RemoveCircleOutlined';
import { connect } from 'react-redux';
import {
	updateForumSubscriptions
} from '../../actions/actions'

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
		let newSubscriptionsArray = this.props.forumSubscriptions.slice();
		for (var i = 0; i < newSubscriptionsArray.length; i++) {
			if (newSubscriptionsArray[i].address === forumContext) {
				newSubscriptionsArray.splice(i, 1)
			}
		}
		this.props.dispatch(updateForumSubscriptions(newSubscriptionsArray))
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
		forumSubscriptions: state.forum.forumSubscriptions
	};
}

export default connect(mapStateToProps)(withStyles(styles)(UnsubscribeButton));