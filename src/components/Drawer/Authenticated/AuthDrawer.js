import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import DrawerListContainer from './DrawerListContainer';
import { connect } from 'react-redux';
import UserContract from '../../../contracts/User.json';
import CreateForumDialog from '../../Buttons/ButtonDialogs/CreateForumDialog'

const styles = theme => ({
	drawerPaper: {
		position: 'fixed',
		marginTop: 65,
		width: '15%',
		boxShadow: "2px 4px 40px #9E9E9E",
	}
});

class AuthDrawer extends Component {
	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<Drawer
					variant="permanent"
					classes={{
						paper: classes.drawerPaper,
					}}>
					<DrawerListContainer forums={this.props.userSettings[this.props.currentUserAddress].subscriptions} />
					<CreateForumDialog />
				</Drawer>
			</div>
		);
	}
}


AuthDrawer.propTypes = {
	classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
	return {
		web3: state.web3,
		tartarusAddress: state.tartarus.tartarusAddress,
		currentUserAddress: state.accounts.currentUserAddress,
		userSettings: state.accounts.userSettings,
	};
}

export default connect(mapStateToProps)(withStyles(styles)(AuthDrawer));