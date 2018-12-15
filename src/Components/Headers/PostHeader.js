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
				    <p>Metamask address = {this.props.currentOwnerAddress}</p>
            <p>User address = {this.props.currentUserAddress}</p>
            <p>Current post = {this.props.currentPost}</p>
            <p>Current post address = {this.props.currentPostAddress}</p>
			</div>
		)
	}
}

export default withStyles(styles)(PostHeader)
