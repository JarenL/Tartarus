import React, { Component } from 'react'
import { connect } from 'react-redux'
import Divider from '@material-ui/core/Divider';
import CommentContract from '../../../contracts/Comment.json'
import Loading from '../../Loading'
import { setCurrentPage, setCurrentPostAddress, setCurrentCommentAddress } from '../../../redux/actions/actions'
import CommentListContainer from '../Comment/CommentListContainer'
import ipfs from '../../../services/ipfs/ipfs'
import CommentHeader from './CommentHeader';

class CommentPage extends Component {
	constructor(match) {
		super(match)
		this.state = {
			currentComment: null,
			loading: true
		}
		this.instantiateContract = this.instantiateContract.bind(this)
	}

	componentDidMount() {
		this.props.dispatch(setCurrentPage("Comment"))
		this.props.dispatch(setCurrentCommentAddress(this.props.match.params.commentAddress))
		this.instantiateContract()
	}

	componentDidUpdate = (newProps) => {
		console.log(newProps.match.params.commentAddress);
		console.log(this.props.match.params.commentAddress)
		console.log("hello")
		if (newProps.match.params.commentAddress !== this.props.match.params.commentAddress	) {
			console.log("comment reply")
			this.props.dispatch(setCurrentCommentAddress(this.props.match.params.commentAddress))
			this.setState({
				loading: true,
			})
			this.instantiateContract()
		}
	}

	instantiateContract = () => {
		const contract = require('truffle-contract')
		const comment = contract(CommentContract)
		comment.setProvider(this.props.web3.currentProvider)
		comment.at(this.props.currentCommentAddress).then((instance) => {
			instance.owner.call().then((owner) => {
				this.props.dispatch(setCurrentPostAddress(owner))
				instance.commentInfo.call().then((result) => {
					const bs58 = require('bs58')
					const hashHex = "1220" + result[0].slice(2)
					const hashBytes = Buffer.from(hashHex, "hex")
					const hashString = bs58.encode(hashBytes)
					ipfs.catJSON(hashString, (err, ipfsData) => {
						this.setState({
							currentComment: ipfsData.comment,
							loading: false
						})
					})
				})
			})
		}).catch((err) => {
			console.log("error")
		})
	}

	render() {
		if (this.state.loading) {
			return (
				<div>
					<Loading/>
					<Divider />
					<Loading />
				</div>
			)
		} else {
			return (
				<div>
					<CommentHeader />
					<Divider />
					<CommentListContainer />
				</div>
			)
		}
	}
}

function mapStateToProps(state) {
	return {
		web3: state.web3,
		accounts: state.accounts,
		currentCommentAddress: state.forum.currentCommentAddress
	};
}

export default connect(mapStateToProps)(CommentPage);