import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ForumList from '../Components/ForumList';

const styles = theme => ({
    drawerPaper: {
        position: 'ablsolute',
        marginTop: 65,
        width: '15%'
    }
});

class ForumListContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}>
                    <ForumList/>
                </Drawer>
            </div>
        );
    }
}

ForumListContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ForumListContainer);
