import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
    drawerPaper: {
        position: 'ablsolute',
        marginTop: 65,
        width: '15%'
    }
});

class UnauthDrawer extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}>
                    <List>
                        <ListItem button>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Frontpage" />
                        </ListItem>
                        <Divider />
                        <p>you need an account</p>
                    </List>				
                </Drawer>
            </div>
        );
    }
}


UnauthDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UnauthDrawer);