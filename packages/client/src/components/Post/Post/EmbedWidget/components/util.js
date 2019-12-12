import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  iframe: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '19%'
  },
  js: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  progress: {
    color: '#33a0ff',
    margin: theme.spacing.unit * 2
  }
});

let LoadingIframe = props => {
  const { classes } = props;

  return (
    <div className={classes.iframe}>
      <CircularProgress className={classes.progress} size={40} />
    </div>
  );
};
LoadingIframe = withStyles(styles)(LoadingIframe);

let LoadingJs = props => {
  const { classes } = props;

  return (
    <div className={classes.js}>
      <CircularProgress className={classes.progress} size={40} />
    </div>
  );
};
LoadingJs = withStyles(styles)(LoadingJs);

const addScript = (url, cb) => {
  const script = document.createElement('script');
  script.src = url;
  script.async = true;
  if (cb) {
    script.addEventListener('load', cb);
  }
  document.body.appendChild(script);
};

export { LoadingIframe, LoadingJs, addScript };
