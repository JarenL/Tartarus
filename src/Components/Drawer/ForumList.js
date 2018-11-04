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
  setCurrentForum, setCurrentForumAddress
} from '../../actions/actions'


class ForumList extends Component {
  changeForum = (forum) => {
    console.log("forum clicked")
    console.log(forum.name)
    this.props.dispatch(setCurrentForum(forum.name))
    this.props.dispatch(setCurrentForumAddress(forum.address))
  }
  render() {
    const forumContainers = this.props.forums.map(forum => {
      return (
        <div key={forum.address} onClick={() => this.changeForum(forum)}>
          <ForumContainer
            address={forum.address}
            name={forum.name} />
        </div>
      )
    });

    return (
      <List>
        <ListItem button onClick={() => this.changeForum({ name: "Frontpage", address: null })}>
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

export default connect()(ForumList);