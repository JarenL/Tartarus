import React, { Component } from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/AddCircle';

export default class CreateForumButton extends Component {
  render() {
    return (
      <div>
        <ListItem button>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add Forum" />
        </ListItem>
      </div>
    )
  }
}
