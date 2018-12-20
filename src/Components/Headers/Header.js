import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
	header: {
		height: '15%',
		paddingTop: '18px',
		paddingBottom: '18px',
		paddingLeft: '20px',
		paddingRight: '20px',
		margin: '0px',
	},
	uAddress: {
		fontWeight: 'bold',
		fontSize: '12px',
		color: '#6A6A6A',
		display: 'inline-block',
		paddingTop: '0px',
		marginTop: '0px',
	},
	oAddress: {
		fontSize: '12px',
		color: 'grey',
		display: 'inline-block',
		paddingLeft: '4px',
	},
	fAddress: {
		fontSize: '12px',
		color: 'grey',
		display: 'inline-block',
		paddingBottom: '0px',
		marginBottom: '0px',
	},
	forum: {
		fontWeight: 'bold',
		fontSize: '25px',
		paddingTop: '0px',
		paddingBottom: '0px',
		paddingRight: '20px',
		margin: '0px',
	},
});

class Header extends Component {
	render() {
		const { classes } = this.props;
		return (
			<div className={classes.header}>
				<p className={classes.uAddress}>Posted by {this.props.currentUserAddress}</p>
				<p className={classes.oAddress}>from {this.props.currentOwnerAddress}</p>
				<p className={classes.forum}>{this.props.currentForum}</p>
            	<p className={classes.fAddress}>Forum Address: {this.props.currentForumAddress}</p>
			</div>
		)
	}
}

export default withStyles(styles)(Header)
