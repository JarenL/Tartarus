import React, { Component } from 'react'
import PostListContainer from '../Post/PostListContainer'
import ForumHeader from '../Headers/ForumHeader'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ForumContract from '../../../build/contracts/Forum.json'
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import { setCurrentPage } from '../../actions/actions' 


const styles = theme => ({
	// header: {
	// 	display: 'flex',
	// 	backgroundColor: 'red',
	// 	flexDirection: 'row',
	// 	justifyContent: 'space-around'
	// }
});

class ForumPage extends Component {
	constructor(match) {
		super(match)
		this.state = {
			forumAddress: match.match.params.forumAddress,
			forumName: null,
			loading: true
		}
		this.instantiateContract = this.instantiateContract.bind(this)
	}

	componentDidMount() {
		this.instantiateContract()
		this.props.dispatch(setCurrentPage("Forum"))
	}

	instantiateContract = () => {
		const contract = require('truffle-contract')
		const forum = contract(ForumContract)
		forum.setProvider(this.props.web3.currentProvider)
		forum.at(this.state.forumAddress).then((instance) => {
			instance.forumName.call().then((res) => {
				if (res !== null) {
					this.setState({
						forumName: res,
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
					<ForumHeader
						currentOwnerAddress={this.props.accounts.currentOwnerAddress}
						currentUserAddress={this.props.accounts.currentUserAddress}
						currentForum={this.state.forumName}
						currentForumAddress={this.state.forumAddress}
					/>
					<Divider/>
					<PostListContainer />
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

export default connect(mapStateToProps)(withStyles(styles)(ForumPage));