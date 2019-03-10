import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import CommentContainer from './CommentContainer';
import { connect } from 'react-redux'

const styles = theme => ({
	header: {
		// height: '15%',
		paddingTop: '18px',
		// paddingBottom: '18px',
		// paddingLeft: '20px',
		// paddingRight: '20px',
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
	cAddress: {
		fontSize: '12px',
		color: 'grey',
		display: 'inline-block',
		paddingBottom: '0px',
		marginBottom: '0px',
	},
	comment: {
		fontWeight: 'bold',
		fontSize: '25px',
		paddingTop: '0px',
		paddingBottom: '0px',
		paddingRight: '20px',
		margin: '0px',
	},
});

class CommentHeader extends Component {
	render() {
		const { classes } = this.props;
		return (
			// <div className={classes.header}>
			// 	<p className={classes.uAddress}>Posted by {this.props.currentUserAddress}</p>
			// 	<p className={classes.oAddress}>from {this.props.currentOwnerAddress}</p>
			// 	<p className={classes.comment}>{this.props.currentComment}</p>
			// 	<p className={classes.cAddress}>Comment Address: {this.props.currentCommentAddress}</p>
			// </div>
			<div className={classes.header}>
				<CommentContainer
					address={this.props.currentCommentAddress}
				/>
			</div>
		)
	}
}

function mapStateToProps(state) {
  return {
    currentCommentAddress: state.forum.currentCommentAddress
  };
}

export default connect(mapStateToProps, null, null, {
  pure: false
})(withStyles(styles)(CommentHeader));