import React, { Component } from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';

export default class FrontPageListItem extends Component {
  render() {
    return (
      <div onClick={() => this.props.changeForum({name : "Frontpage", address : null})}>
        <ListItem button>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Frontpage" />
        </ListItem>
      </div>
    )
  }
}
