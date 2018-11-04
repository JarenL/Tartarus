import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import AddComment from '@material-ui/icons/AddComment';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit + 40,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
});

function CreateForumButton (props) {
    const { classes } = props;
    return (
        <div>
            <Button variant="contained" color="secondary" className={classes.button}>
                Create Forum
                <AddComment className={classes.rightIcon} />

            </Button>
        </div>
    );
}

CreateForumButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateForumButton);
