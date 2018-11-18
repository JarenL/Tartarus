import React, { Component } from 'react'
import { connect } from 'react-redux'
import PostHeader from '../Headers/PostHeader'
import Divider from '@material-ui/core/Divider';
import PostContract from '../../../build/contracts/Post.json'
import CircularProgress from '@material-ui/core/CircularProgress';
import { setCurrentPage } from '../../actions/actions' 

class PostPage extends Component {
	constructor(match) {
		super(match)
		console.log(match.match.params.postAddress)
		this.state = {
			postAddress: match.match.params.postAddress,
			postTitle: null,
			loading: true
		}
		this.instantiateContract = this.instantiateContract.bind(this)
	}

	componentDidMount() {
		this.instantiateContract()
		this.props.dispatch(setCurrentPage("Post"))
	}

	instantiateContract = () => {
		console.log(this.props)
		const contract = require('truffle-contract')
		const post = contract(PostContract)
		post.setProvider(this.props.web3.currentProvider)
		post.at(this.state.postAddress).then((instance) => {
			instance.postTitle.call().then((res) => {
				console.log(res);
				if (res !== null) {
					this.setState({
						postTitle: res,
						loading: false
					})
				}
			})
		}).catch((err) => {
			console.log("error")
		})
	}

	render() {
		if (this.state.loading) {
			return (
				<CircularProgress/>
			)
		} else {
			return (
				<div>
					<PostHeader
						currentOwnerAddress={this.props.accounts.currentOwnerAddress}
						currentUserAddress={this.props.accounts.currentUserAddress}
						currentPost={this.state.postTitle}
						currentPostAddress={this.state.postAddress}
					/>
					<Divider/>
					{/* <CommentListContainer /> */}
				</div>
			)
		}
	}
}

function mapStateToProps(state) {
	return {
		web3: state.web3,
		accounts: state.accounts,
	};
}

export default connect(mapStateToProps)(PostPage);