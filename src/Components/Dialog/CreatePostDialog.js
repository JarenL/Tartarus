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
import CreatePostButton from '../Buttons/CreatePostButton.js';
import ipfs from '../../ipfs';

const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	}
});

class CreatePostDialog extends Component {
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
		this.createPost = this.createPost.bind(this);
	}

	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	submit = () => {
		this.handleClose();
		this.createPost(this.state.dialogText);
	}

	setDialogText = (event) => {
		this.setState({ dialogText: event.target.value });
	}

	createPost = (postTitle) => {
		const contract = require('truffle-contract')
		const tartarus = contract(TartarusContract)
		const data = JSON.stringify({
			title: postTitle,
			creator: this.props.accounts.currentUserAddress,
			forum: this.props.currentForumAddress
		})

		ipfs.add(data, (err, hash) => {
			tartarus.setProvider(this.props.web3.currentProvider)
			this.props.web3.eth.getAccounts((error, accounts) => {
				tartarus.at(this.props.tartarusAddress).then((instance) => {
					console.log(hash)
					instance.createPost(
						this.props.currentForumAddress,
						hash,
						{ from: accounts[0], gasPrice: 20000000000 }
					)
				})
			})
		})
	}

	render() {
		return (
			<div>
				<div onClick={this.handleClickOpen}>
					<CreatePostButton />
				</div>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">Post</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Create Post.
            </DialogContentText>
						<TextField
							autoFocus
							onChange={this.setDialogText}
							margin="dense"
							id="name"
							label="Post"
							type="String"
							fullWidth
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
							Cancel
            </Button>
						<Button onClick={this.submit} color="primary">
							Post
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
		currentForum: state.forum.currentForum,
		currentForumAddress: state.forum.currentForumAddress,
		accounts: state.accounts,
	};
}

export default connect(mapStateToProps)(withStyles(styles)(CreatePostDialog));