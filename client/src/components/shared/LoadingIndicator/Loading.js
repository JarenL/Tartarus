import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 2
  },
  progress: {
    color: '#33a0ff',
    margin: theme.spacing.unit * 2
  },
  mb: {
    fontSize: 10,
    fontWeight: 500
  }
});

const Loading = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <CircularProgress className={classes.progress} size={props.size} />
    </div>
  );
};

export default withStyles(styles)(Loading);
