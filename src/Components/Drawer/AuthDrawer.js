import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ForumListContainer from '../Forum/ForumListContainer';
import { connect } from 'react-redux';
import UserContract from '../../contracts/User.json';
import CreateForumDialog from '../Dialog/CreateForumDialog'

import {
  updateForumSubscriptions
} from '../../actions/actions'

const styles = theme => ({
	drawerPaper: {
		position: 'ablsolute',
		marginTop: 65,
		width: '15%',
		boxShadow: "2px 4px 40px #9E9E9E",
	}
});

class AuthDrawer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			forums: []
		}
    this.instantiateContract = this.instantiateContract.bind(this);
	}

	componentDidMount() {
    this.instantiateContract();
  }

	instantiateContract() {
		const contract = require('truffle-contract')
		const user = contract(UserContract)
		// user.setProvider(this.props.web3.currentProvider)
		// user.at(this.props.accounts.currentUserAddress).then((instance) => {
		// 	instance.SubscribeForum({}, { fromBlock: 0, toBlock: 'latest' }).get((error, result) => {
		// 		let newForumArray = this.state.forums.slice();
		// 		result.forEach((result) => {
		// 			newForumArray.push({
		// 				address: result.args.forumAddress,
		// 			});
		// 		})
		// 		this.props.dispatch(updateForumSubscriptions(newForumArray))
		// 	})
		// })
	}

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<Drawer
					variant="permanent"
					classes={{
						paper: classes.drawerPaper,
					}}>
					<ForumListContainer forums={this.props.forumSubscriptions} />
					<CreateForumDialog />
				</Drawer>
			</div>
		);
	}
}


AuthDrawer.propTypes = {
	classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
	return {
		web3: state.web3,
		tartarusAddress: state.tartarus.tartarusAddress,
		accounts: state.accounts,
		forumSubscriptions: state.forum.forumSubscriptions
	};
}

export default connect(mapStateToProps)(withStyles(styles)(AuthDrawer));
