import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Message from '@material-ui/icons/Message';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  }
});

function CreatePostButton(props) {
  const { classes } = props;
  return (
    <div>
      <Button variant="contained" color="secondary" className={classes.button}>
        Create Post
                <Message className={classes.rightIcon} />
      </Button>
    </div>
  );
}

CreatePostButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreatePostButton);
