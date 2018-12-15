import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import UserContract from '../../contracts/User.json';
import { connect } from 'react-redux'
import AddForumButton from '../Buttons/AddForumButton'

class AddForumDialog extends Component {
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
		this.subscribeForum = this.createForum.bind(this);
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


	subscribeForum= (forum) => {
		const contract = require('truffle-contract')
		const user = contract(UserContract)
		user.setProvider(this.props.web3.currentProvider)
		this.props.web3.eth.getAccounts((error, accounts) => {
			user.at(this.props.accounts.currentUserAddress).then((instance) => {
				instance.createForum(
					forum.Address,
					forum.Name,
					{ from: accounts[0], gasPrice: 20000000000 }
				)
			})
		})
	}
	render() {
		return (
			<div>
				<div onClick={this.handleClickOpen}>
					<AddForumButton />
				</div>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
					<DialogContent>
						<DialogContentText>
							To subscribe to forum, enter its contract address. Incorrect address will result in transsaction failure.
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
		accounts: state.accounts
	};
}

export default connect(mapStateToProps)(AddForumDialog);