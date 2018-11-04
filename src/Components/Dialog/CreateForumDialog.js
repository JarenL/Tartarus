import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import TartarusContract from '../../../build/contracts/Tartarus.json';
import { connect } from 'react-redux'
import CreateForumButton from '../Buttons/CreateForumButton'

const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	}
});

class CreateForumDialog extends Component {
	constructor(props) {
		super(props)

		this.state = {
			open: false,
			dialogText: null
		}

		this.handleClickOpen = this.handleClickOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.submit = this.submit.bind(this);
		this.setDialogText = this.setDialogText.bind(this);
		this.createForum = this.createForum.bind(this);
	}

	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	submit = () => {
		this.handleClose();
		this.createForum(this.state.dialogText);
	}

	setDialogText = (event) => {
		this.setState({ dialogText: event.target.value });
	}


	createForum = (forumName) => {
		const contract = require('truffle-contract')
		const tartarus = contract(TartarusContract)
		tartarus.setProvider(this.props.web3.currentProvider)
		console.log(this.props)
		this.props.web3.eth.getAccounts((error, accounts) => {
			tartarus.at(this.props.tartarusAddress).then((instance) => {
				instance.createForum(
					forumName,
					{ from: accounts[0], gasPrice: 20000000000 }
				)
			})
		})
	}
	render() {
		return (
			<div>
				<div onClick={this.handleClickOpen}>
					<CreateForumButton />
				</div>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
					<DialogContent>
						<DialogContentText>
							To subscribe to this website, please enter the name of your forum here. We will send
							updates occasionally.
            </DialogContentText>
						<TextField
							autoFocus
							onChange={this.setDialogText}
							margin="dense"
							id="name"
							label="Forum Title"
							type="String"
							fullWidth
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
							Cancel
            </Button>
						<Button onClick={this.submit} color="primary">
							Subscribe
            </Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		web3: state.web3,
		tartarusAddress: state.tartarus.tartarusAddress,
	};
}

export default connect(mapStateToProps)(withStyles(styles)(CreateForumDialog));