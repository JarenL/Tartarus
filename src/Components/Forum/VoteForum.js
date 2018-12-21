import React, { Component, Children, PropTypes } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const VoteButton = withStyles({
  root: {
    float: 'right'
  },

  styles: {
    // eslint-disable-next-line no-undef
    backgroundImage: url(
      'https://drive.google.com/uc?export=view&id=0B-0mOGblD8opOHhvWmpkZk14MUk'
    ),
    height: '13px',
    width: '16px',
    backgroundSize: 'cover',
    display: 'inline-block',
    marginRight: '0.5em',
    cursor: 'pointer',
    opacity: 0.75,
    transition: '150ms ease opacity'
  },

  // visual representation of the voteCount
  voteCount: {
    backgroundColor: '#2399ff',
    display: 'inline-block',
    borderRadius: '50%',
    width: '25px',
    height: '25px',
    textAlign: 'center',
    color: '#ffffff',
    fontSize: '12px',
    lineHeight: '2.2'
  }
})(Button);

export default function ClassesShorthand() {
  return <VoteButton>Classes Shorthand</VoteButton>;
}
