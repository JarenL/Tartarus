import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    }
});

function AddForumButton(props) {
    const { classes } = props;
    return (
        <div>
            <Button variant="contained" color="secondary" className={classes.button}>
                Create Forum
            </Button>
        </div>
    );
}

AddForumButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddForumButton);
