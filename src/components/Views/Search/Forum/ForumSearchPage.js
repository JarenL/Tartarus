import React, { Component } from 'react'
import { connect } from 'react-redux'
import TartarusContract from '../../../../contracts/Tartarus.json'
import Loading from '../../../Loading'
import SearchHeader from '../SearchHeader.js';
import SearchResultContainer from '../SearchResultContainer.js';

class ForumSearchPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			forums: [],
			loading: true
		}
		this.instantiateContract = this.instantiateContract.bind(this)
	}

	componentDidMount() {
		this.instantiateContract()
	}

	instantiateContract = () => {
		const contract = require('truffle-contract')
		const tartarus = contract(TartarusContract)
		tartarus.setProvider(this.props.web3.currentProvider)
		tartarus.at(this.props.tartarusAddress).then((instance) => {
			instance.ForumCreated({}, { fromBlock: 0, toBlock: 'latest' }).get((error, result) => {
				let newSearchList = this.state.forums.slice()
				result.forEach((forum) => {
					newSearchList.push({
						address: forum.args.forumAddress
					})
					this.setState({
						forums: newSearchList
					})
				})
				this.setState({
					loading: false
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
					<SearchHeader />
					<Loading/>
				</div>
			)
		} else {
			return (
				<div>
					<SearchHeader />
					<SearchResultContainer forums={this.state.forums} />
				</div>
			)
		}
	}
}

function mapStateToProps(state) {
	return {
		web3: state.web3,
		tartarusAddress: state.tartarus.tartarusAddress
	};
}

export default connect(mapStateToProps)(ForumSearchPage);