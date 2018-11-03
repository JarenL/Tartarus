import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PostList from '../Components/PostList';
import { connect } from 'react-redux';
import ForumContract from '../../build/contracts/Forum.json';
import CreatePostButton from '../Components/Buttons/CreatePostButton'

class PostListContainer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			posts: [],
		}
	}

    // event PostCreated (address postAddress, string posttitle, address postOwner, uint timestamp);  

	instantiateContract() {
		console.log(this.props.forum)
		const contract = require('truffle-contract')
		const forum = contract(ForumContract)
		forum.setProvider(this.props.web3.currentProvider)
		forum.at(this.props.forum.currentForumAddress).then((instance) => {
			const postCreationEvent = instance.PostCreated({ fromBlock: 0, toBlock: 'latest' });
			postCreationEvent.watch((error, result) => {
				let newPostArray = this.state.posts.slice();
				newPostArray.push({
                    title: result.args.postTitle,
                    author: result.args.postAuthor,
					address: result.args.postAddress
				});
				this.setState({
					posts: newPostArray
				});
				console.log(newPostArray);
			})
		})
	}

	render() {
		console.log(this.state.posts)
		return (
			<div> 
                <CreatePostButton/>
                <p>Hello</p>
				<PostList posts={this.state.posts}/>
			</div>
		);
	}
}

PostListContainer.propTypes = {
	classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
	return {
		web3: state.web3,
		tartarusAddress: state.tartarus.tartarusAddress,
		accounts: state.accounts,
        currentForum: state.forum.currentForum,
        currentForumAddress: state.forum.currentForumAddress

	};
}

export default connect(mapStateToProps)(PostListContainer);
