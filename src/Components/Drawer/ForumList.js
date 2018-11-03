import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import Divider from '@material-ui/core/Divider';
import ForumContainer from '../../Containers/ForumContainer';
import {
    setCurrentForum
} from '../../actions/actions'


class ForumList extends Component {
    changeForum = () => {
        console.log("hello")
        this.props.dispatch(setCurrentForum("hello"))
    }
    render() {
        const forumContainers = this.props.forums.map(forum => {
            return (
                <div key={forum.address}>
                    <ForumContainer
                        address={forum.address}
                        name={forum.name} />
                </div>
            )
        });

        return (
            <List>
                <ListItem button onClick={this.changeForum.bind(this)}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Frontpage" />
                </ListItem>
                <Divider />
                {forumContainers}
            </List>
        );
    }

}

function mapStateToProps(state) {
    return {
        web3: state.web3,
        tartarusAddress: state.tartarus.tartarusAddress,
        accounts: state.accounts,
        currentForum: state.currentForum
    };
}

export default connect(mapStateToProps)(ForumList);