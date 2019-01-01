import React, { Component } from 'react'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import PostIcon from '@material-ui/icons/ChatRounded';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Badge from '@material-ui/core/Badge';
import UpArrow from '@material-ui/icons/ArrowUpwardTwoTone';
import AddComment from '@material-ui/icons/AddComment';
import Grid from '@material-ui/core/Grid'
import TimeAgo from 'timeago-react';

const styles = theme => ({
  actions: {
    display: 'flex',
  },
  avatar: {
    backgroundColor: red[500],
    marginLeft: 19,
    marginBottom: 15,
    marginTop: 15
  },
  buttons: {
    direction: 'column',
  },
  post: {
    borderRadius: '10px',
    marginTop: '0px',
    marginBottom: '15px'
  },
  postBody: {
    // height: '10%',
    // paddingTop: '15px',
    // paddingBottom: '18px',
    // paddingLeft: '20px',
    // paddingRight: '5px',
    // margin: '0px',
  },
  creatorAddress: {
    fontWeight: 'bold',
    fontSize: '12px',
    color: '#6A6A6A',
    display: 'inline-block',
    paddingTop: '0px',
    marginTop: '0px',
  },
  time: {
    fontSize: '12px',
    color: 'grey',
    display: 'inline-block',
    // paddingLeft: '4px',
    paddingTop: '0px',
    marginTop: '0px',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '15px',
    marginTop: 20,
    // paddingTop: '0px',
    // paddingBottom: '0px',
    // paddingRight: '20px',
    // paddingLeft: '20px',

    margin: '0px',

  },
  postAddress: {
    fontSize: '12px',
    color: 'grey',
    display: 'inline-block',
    paddingBottom: '0px',
    marginBottom: '0px',
  },

  upvote: {
    marginLeft: 15
  },
  commentButton: {
    marginLeft: 15
  }
})

class Post extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.post}>
        <Grid container direction="row">
            <Grid item xs={1}>
              <Avatar aria-label="icon" className={classes.avatar}>
                <PostIcon />
              </Avatar>
            </Grid>
            <Grid item >
              <p className={classes.title}>{this.props.title}</p>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid item xs={1}>
              <Grid container direction={"column"} justify="center">
                <Grid item className={classes.upvote}>
                  <IconButton>
                    <Badge badgeContent={400} color="secondary" >
                      <UpArrow />
                    </Badge>
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction={"column"} className={classes.postBody}>
                <Grid item className={classes.postAddress}>
                  <p className={classes.postAddress}>Post Address: {this.props.address}</p>
                </Grid>
                <Grid item className={classes.creatorAddress}>
                  <p className={classes.creatorAddress}>Created by {this.props.creator}</p>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid item xs={1} className={classes.commentButton}>
              <IconButton aria-label="add-comment">
                <Badge badgeContent={400} color="secondary" >
                  <AddComment />
                </Badge>
              </IconButton>
            </Grid>
            <Grid item className={classes.time}>
              <p classes={classes.time}><TimeAgo datetime={this.props.time} /></p>
            </Grid>
          </Grid>
      </Card >
    )
  }
}

export default withStyles(styles)(Post);