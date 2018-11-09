import React, { Component } from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Message from '@material-ui/icons/Message';

export default class Forum extends Component {
    render() {
        return (
            <ListItem button>
                <ListItemIcon>
                    <Message />
                </ListItemIcon>
                <ListItemText primary={this.props.name} />
            </ListItem>   
        )     
    }
}
