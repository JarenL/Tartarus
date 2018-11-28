import React, { Component } from 'react'
import PostListContainer from '../Post/PostListContainer'
import ForumHeader from '../Headers/ForumHeader'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ForumContract from '../../../build/contracts/Forum.json'
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import { setCurrentPage, setCurrentForumAddress } from '../../actions/actions' 


const styles = theme => ({
	// header: {
	// 	display: 'flex',
	// 	backgroundColor: 'red',
	// 	flexDirection: 'row',
	// 	justifyContent: 'space-around'
	// }
});

class ForumPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			forumName: null,
			loading: true
		}
		this.instantiateContract = this.instantiateContract.bind(this)
	}

	componentDidMount() {
		this.props.dispatch(setCurrentPage("Forum"))
		this.props.dispatch(setCurrentForumAddress(this.props.match.params.forumAddress))
		this.instantiateContract()
	}

	componentDidUpdate = (newProps) => {
    if (newProps.currentForumAddress !== this.props.currentForumAddress) {
			this.setState({
				loading: true
			})
      this.instantiateContract()
    }
  }

	instantiateContract = () => {
		const contract = require('truffle-contract')
		const forum = contract(ForumContract)
		forum.setProvider(this.props.web3.currentProvider)
		forum.at(this.props.match.params.forumAddress).then((instance) => {
			instance.name.call().then((result) => {
				if (result !== null) {
					this.setState({
						forumName: result,
						loading: false
					})
				}
			})
			instance.owner.call().then((result) => {
				console.log(result)
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
						currentForumAddress={this.props.currentForumAddress}
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
		currentForumAddress: state.forum.currentForumAddress
	};
}

export default connect(mapStateToProps)(withStyles(styles)(ForumPage));