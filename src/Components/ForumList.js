import React, { Component } from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import StarIcon from '@material-ui/icons/Star';
import SendIcon from '@material-ui/icons/Send';
import HoemIcon from '@material-ui/icons/Home';
import Divider from '@material-ui/core/Divider';

export default class ForumList extends Component {
    render() {
        return (
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <HoemIcon />
                    </ListItemIcon>
                    <ListItemText primary="Frontpage" />
                </ListItem>
                <Divider />
                <ListItem button>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inbox" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <StarIcon />
                    </ListItemIcon>
                    <ListItemText primary="Starred" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <SendIcon />
                    </ListItemIcon>
                    <ListItemText primary="Send mail" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Drafts" />
                </ListItem>
            </List>
        )
    }
}
