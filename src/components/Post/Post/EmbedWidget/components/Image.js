import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  image: {
    // maxHeight: '100%',
    // maxWidth: '100%',
    paddingTop: '6px',
    // transform: 'translateX(-50%)',
    // marginLeft: '50%',
    animation: 'fadeIn ease 0.5s',
    width: '100%',
    // Without height undefined it won't work
    height: undefined,
    // figure out your image aspect ratio
    // aspectRatio: 135 / 76,
  }
};

const Image = props => {
  return <img className={props.classes.image} src={props.url} />;
};

export default withStyles(styles)(Image);
