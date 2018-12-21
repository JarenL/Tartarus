import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  }
});

function CreateUserButton(props) {
  const { classes } = props;
  return (
    <div>
      <Button variant="contained" color="secondary" className={classes.button}>
        Create User
                <AccountCircle className={classes.rightIcon} />
      </Button>
    </div>
  );
}

CreateUserButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateUserButton);
