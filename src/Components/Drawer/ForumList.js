import React from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import Divider from '@material-ui/core/Divider';
import ForumContainer from '../../Containers/ForumContainer';


const ForumList = (props) => {
    const forumContainers = props.forums.map(forum => {
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
            <ListItem button>
                <ListItemIcon>
                    <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Frontpage" />
            </ListItem>
            <Divider/>
            {forumContainers}
        </List>
    );
}

export default ForumList

// <List>
/* <ListItem button>
    <ListItemIcon>
        <HoemIcon />
    </ListItemIcon>
    <ListItemText primary="Frontpage" />
</ListItem> */
// <Divider />
// <ListItem button>
//     <ListItemIcon>
//         <InboxIcon />
//     </ListItemIcon>
//     <ListItemText primary="Inbox" />
// </ListItem>
// <ListItem button>
//     <ListItemIcon>
//         <StarIcon />
//     </ListItemIcon>
//     <ListItemText primary="Starred" />
// </ListItem>
// <ListItem button>
//     <ListItemIcon>
//         <SendIcon />
//     </ListItemIcon>
//     <ListItemText primary="Send mail" />
// </ListItem>
// <ListItem button>
//     <ListItemIcon>
//         <DraftsIcon />
//     </ListItemIcon>
//     <ListItemText primary="Drafts" />
// </ListItem>
// </List>
