import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import PostContact from '../../../build/contracts/Post.json';
import { connect } from 'react-redux'
import CreateCommentButton from '../Buttons/CreateCommentButton';

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
		this.createPost(this.state.dialogText);
	}

	setDialogText = (event) => {
		this.setState({ dialogText: event.target.value });
	}

	createComment = (commentText) => {
		// const contract = require('truffle-contract')
		// const post = contract(ForumContract)
		// post.setProvider(this.props.web3.currentProvider)
		// this.props.web3.eth.getAccounts((error, accounts) => {
		// 	post.at(this.props.currentForumAddress).then((instance) => {
		// 		instance.createPost(
		// 			postTitle,
		// 			{ from: accounts[0], gasPrice: 20000000000 }
		// 		)
		// 	})
		// })
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
					<DialogTitle id="form-dialog-title">Post</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Create Comment.
            </DialogContentText>
						<TextField
							autoFocus
							onChange={this.setDialogText}
							margin="dense"
							id="name"
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
		currentForum: state.forum.currentForum,
		currentForumAddress: state.forum.currentForumAddress

	};
}

export default connect(mapStateToProps)(withStyles(styles)(CreateCommentDialog));