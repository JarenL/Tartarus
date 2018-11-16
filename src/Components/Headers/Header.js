import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  header: {
		height: '15%',
  },
});

class Header extends Component {
	render() {
		const { classes } = this.props;
		return (
			<div className={classes.header}>
				    <p>Metamask address = {this.props.currentOwnerAddress}</p>
            <p>User address = {this.props.currentUserAddress}</p>
            <p>Current forum = {this.props.currentForum}</p>
            <p>Current forum address = {this.props.currentForumAddress}</p>
			</div>
		)
	}
}

export default withStyles(styles)(Header)
