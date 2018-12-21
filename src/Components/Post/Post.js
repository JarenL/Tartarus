import React, { Component } from 'react'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import PropTypes from 'prop-types';
import ShareIcon from '@material-ui/icons/Share';
import PostIcon from '@material-ui/icons/ChatRounded';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Badge from '@material-ui/core/Badge';
import UpArrow from '@material-ui/icons/ArrowUpwardTwoTone';
import AddComment from '@material-ui/icons/AddComment';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
  actions: {
    display: 'flex',
  },
  avatar: {
    backgroundColor: red[500],
  },
  buttons: {
    direction: 'column',
  },
  root: {
    flexGrow: 1,
    direction: "row"
  }
});

// https://ropsten.etherscan.io/address/xxxxx

class Post extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Card className="post">
        <CardHeader
          avatar={
            <Avatar aria-label="icon" className={classes.avatar}>
              <PostIcon />
            </Avatar>
          }
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={"Title - " + this.props.title}
        />
        <CardContent>
          <Grid container direction="row">
            <Grid item>
              <Grid container direction={"column"} xs={3} justify="center">
                <Grid item xs={3}>
                  <IconButton aria-label="upvote">
                    <UpArrow />
                  </IconButton>
                </Grid>
                <Grid item xs={3}>
                  1000
                </Grid>
                <Grid item xs={3}>
                  <IconButton aria-label="add-comment">
                    <Badge badgeContent={400} color="secondary" classes={{ badge: classes.badge }}>
                      <AddComment />
                    </Badge>
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid container direction={"column"} xs={9} justify="flex-start">
              <Grid item>
                Address - {this.props.address}
              </Grid>
              <Grid item>
                Creator - {this.props.creator}
              </Grid>
              <Grid item>
                Time - {this.props.time}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }
}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Post);