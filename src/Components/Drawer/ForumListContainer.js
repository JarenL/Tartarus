import React, { Component } from 'react';
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import ForumList from './ForumList'
import { Link } from 'react-router-dom';
import {
  setCurrentForum, setCurrentForumAddress
} from '../../actions/actions'


class ForumListContainer extends Component {
  changeForum = (forum) => {
    console.log("forum clicked")
    console.log(forum.name)
    this.props.dispatch(setCurrentForum(forum.name))
    this.props.dispatch(setCurrentForumAddress(forum.address))
  }
  render() {
    return (
      <div>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div onClick={() => this.changeForum({ name: "Frontpage", address: null })}>
            <ListItem button>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Frontpage" />
            </ListItem>
          </div>
        </Link>
        <Divider />
        <ForumList changeForum={this.changeForum} forums={this.props.forums} />
      </div>

    );
  }
}

export default connect()(ForumListContainer);