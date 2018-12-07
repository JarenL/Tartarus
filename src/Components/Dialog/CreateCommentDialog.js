import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import CreateCommentButton from '../Buttons/CreateCommentButton';
import TartarusContract from '../../../build/contracts/Tartarus.json';
import ipfs from '../../ipfs';

const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	}
});

class CreateCommentDialog extends Component {
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
		this.createComment = this.createComment.bind(this);
	}

	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	submit = () => {
		this.handleClose();
		console.log(this.state.dialogText)
		this.createComment(this.state.dialogText);
	}

	setDialogText = (event) => {
		this.setState({ dialogText: event.target.value });
	}

	createComment = (commentText) => {
		const contract = require('truffle-contract')
		const tartarus = contract(TartarusContract)
		const data = JSON.stringify({
			comment: commentText
		})

		ipfs.add(data, (err, hash) => {
			console.log(data)
			console.log(hash)
			tartarus.setProvider(this.props.web3.currentProvider)
			this.props.web3.eth.getAccounts((error, accounts) => {
				tartarus.at(this.props.tartarusAddress).then((instance) => {
					instance.createComment(
						this.props.currentForumAddress,
						this.props.currentPostAddress,
						this.props.currentPostAddress,
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
					<CreateCommentButton />
				</div>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">Comment</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Create Comment.
            </DialogContentText>
						<TextField
							autoFocus
							onChange={this.setDialogText}
							margin="dense"
							id="name"
							multiline
							rows={10}
							label="Comment"
							type="String"
							fullWidth
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
							Cancel
            </Button>
						<Button onClick={this.submit} color="primary">
							Comment
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
		accounts: state.accounts,
		currentForum: state.forum.currentForum,
		currentForumAddress: state.forum.currentForumAddress,
		currentPostAddress: state.forum.currentPostAddress
	};
}

export default connect(mapStateToProps)(withStyles(styles)(CreateCommentDialog));