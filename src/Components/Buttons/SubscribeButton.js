import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/AddCircleOutlined';
import { connect } from 'react-redux';
import {
	updateForumSubscriptions
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
		let newSubscriptionsArray = this.props.forumSubscriptions.slice();
		newSubscriptionsArray.push({
			address : forumContext
		});
		this.props.dispatch(updateForumSubscriptions(newSubscriptionsArray))
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
		forumSubscriptions: state.forum.forumSubscriptions
	};
}

export default connect(mapStateToProps)(withStyles(styles)(SubscribeButton));