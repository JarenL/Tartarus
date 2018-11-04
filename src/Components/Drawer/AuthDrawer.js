import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ForumList from '../../Components/Drawer/ForumList';
import { connect } from 'react-redux';
import UserContract from '../../../build/contracts/User.json';
import CreateForumDialog from '../../Components/Dialog/CreateForumDialog'

const styles = theme => ({
	drawerPaper: {
		position: 'ablsolute',
		marginTop: 65,
		paddingTop: -5,
		width: '15%'
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
		user.setProvider(this.props.web3.currentProvider)
		user.at(this.props.accounts.currentUserAddress).then((instance) => {
			const forumSubscribeEvemt = instance.SubscribeForum({}, { fromBlock: 0, toBlock: 'latest' });
			forumSubscribeEvemt.watch((error, result) => {
				let newForumArray = this.state.forums.slice();
				newForumArray.push({
					address: result.args.forumAddress,
					name: result.args.forumName
				});
				this.setState({
					forums: newForumArray
				});
			})
		})
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
					<ForumList forums={this.state.forums} />
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
		accounts: state.accounts
	};
}

export default connect(mapStateToProps)(withStyles(styles)(AuthDrawer));
