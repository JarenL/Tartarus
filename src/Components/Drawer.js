import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { mailFolderListItems } from './tileData';

const styles = theme => ({
    drawerPaper: {
        position: 'fixed',
        marginTop: '50',
        flex: 1,
        width: '20%',
    },
});

function ClippedDrawer(props) {
    const { classes } = props;

    return (
        <div className={classes.root}>
            <Drawer
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div />
                <List>{mailFolderListItems}</List>
            </Drawer>
        </div>
    );
}

ClippedDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClippedDrawer);
