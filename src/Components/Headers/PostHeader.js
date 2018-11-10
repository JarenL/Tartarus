import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  header: {
		height: '15%',
  },
});

class PostHeader extends Component {
	render() {
		const { classes } = this.props;
		return (
			<div className={classes.header}>
				    <p>Wallet address = {this.props.currentOwnerAddress}</p>
            <p>User address = {this.props.currentUserAddress}</p>
            <p>Current Post = {this.props.currentForum}</p>
            <p>Current Post Address = {this.props.currentForumAddress}</p>
			</div>
		)
	}
}

export default withStyles(styles)(PostHeader)
