import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography'
import MessageIcon from '@material-ui/icons/Message'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import EditIcon from '@material-ui/icons/Edit'
import GetAppIcon from '@material-ui/icons/GetApp'
import { connect } from 'react-redux';

const styles = theme => ({
	profile: {
		marginTop: theme.spacing.unit * 3,
		marginBottom: theme.spacing.unit * 3,
		[theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
			marginTop: theme.spacing.unit * 6,
			marginBottom: theme.spacing.unit * 6
		},
		textAlign: 'center',
		animation: 'fadeIn ease 1s'
	},
	username: {
		margin: theme.spacing.unit
	},
	bio: {
		margin: theme.spacing.unit
	},
	avatar: {
		margin: 'auto',
		marginTop: theme.spacing.unit * 2,
		marginBottom: theme.spacing.unit * 2
	},
	bigAvatar: {
		width: 70,
		height: 70
	},
	count: {
		opacity: 0.5
	},
	leftNudge: {
		transform: 'translateX(-1px)'
	},
	iconSmall: {
		fontSize: 16,
		opacity: 0.5
	},
	button: {
		margin: theme.spacing.unit,
		'& > span': {
			transform: 'translateX(1px)'
		}
	},
	contents: {
		display: 'contents'
	}
})

class Profile extends React.Component {
	render() {
		const { classes } = this.props
		return (
			<div className={classes.profile}>
				<Avatar
					alt={this.props.accounts.currentUserAddress}
					className={classNames(classes.avatar, classes.bigAvatar)}
				>
					{this.props.accounts.currentUserAddress && this.props.accounts.currentUserAddress.substring(0, 2)}
				</Avatar>

				<Typography className={classes.username} variant='title' noWrap gutterBottom>
					<Link to={"/user"} style={{ textDecoration: 'none' }}>{this.props.accounts.currentUserAddress}</Link>
				</Typography>
				<div className={classes.contents}>
					<Button size='small' variant='contained' color='default' className={classes.button}>
						Download&nbsp;
						<GetAppIcon className={classes.iconSmall} />
					</Button>
					<Button size='small' variant='contained' color='default' className={classes.button}>
						Edit&nbsp;
						<EditIcon className={classes.iconSmall} />
					</Button>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
  return {
    web3: state.web3,
    tartarusAddress: state.tartarus.tartarusAddress,
    accounts: state.accounts
  };
}

export default connect(mapStateToProps, null, null, {
  pure: false
})(withStyles(styles, {withTheme: true})(Profile));