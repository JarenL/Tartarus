import React, { Component } from 'react'
import FeedHeader from './FeedHeader'
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux'
import { setCurrentPage } from '../../../redux/actions/actions'
import TartarusContract from '../../../contracts/Tartarus'
import ForumContract from '../../../contracts/Forum'
import PostList from '../Post/PostList'
import Loading from '../../Loading';

class FeedPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			posts: [],
			loading: true
		}
		this.instantiateContract = this.instantiateContract.bind(this)
	}

	componentDidMount = () => {
		this.props.dispatch(setCurrentPage("Frontpage"))
		this.instantiateContract()
	}

	instantiateContract = () => {
		const contract = require('truffle-contract')
		const tartarus = contract(TartarusContract)
		const forum = contract(ForumContract)
		tartarus.setProvider(this.props.web3.currentProvider)
		forum.setProvider(this.props.web3.currentProvider)
		tartarus.at(this.props.tartarusAddress).then((instance) => {
			instance.ForumCreated({}, { fromBlock: 0, toBlock: 'latest' }).get((error, forums) => {
				let forumsProcessed = 0
				console.log(forums)
				while (forums.length !== forumsProcessed) {
					forums.forEach((forumObject) => {
						forum.at(forumObject.args.forumAddress).then((instance) => {
							instance.PostCreated({}, { fromBlock: 0, toBlock: 'latest' }).get((error, posts) => {
								let newPostsList = [...this.state.posts.slice(), ...posts]
								this.setState({
									posts: newPostsList
								})
							})
						})
						forumsProcessed++
					})
				}
				this.setState({
					loading: false
				})
			})
		}).catch((err) => {
			console.log("error")
		})
	}

	render() {
		if (this.props.currentForumAddress === null) {
			if (this.state.loading) {
				return (
					<div>
						<FeedHeader
							currentOwnerAddress={this.props.accounts.currentOwnerAddress}
							currentUserAddress={this.props.accounts.currentUserAddress}
							currentForum={this.props.currentForum}
							currentForumAddress={this.props.currentForumAddress}
						/>
						<Divider />
						<Loading />
					</div>
				)
			} else {
				return (
					<div>
						<FeedHeader
							currentOwnerAddress={this.props.accounts.currentOwnerAddress}
							currentUserAddress={this.props.accounts.currentUserAddress}
							currentForum={this.props.currentForum}
							currentForumAddress={this.props.currentForumAddress}
						/>
						<Divider />
						<PostList posts={this.state.posts} />
					</div>
				)
			}
		}
	}
}

function mapStateToProps(state) {
	return {
		web3: state.web3,
		tartarusAddress: state.tartarus.tartarusAddress,
		accounts: state.accounts,
		currentForum: state.forum.currentForum,
		currentForumAddress: state.forum.currentForumAddress
	};
}

export default connect(mapStateToProps)(FeedPage);