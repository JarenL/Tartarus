import React, { Component } from 'react';
import { Card } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import PostIcon from '@material-ui/icons/ChatRounded';
import Badge from '@material-ui/core/Badge';
import UpArrow from '@material-ui/icons/ArrowUpwardTwoTone';
import DownArrow from '@material-ui/icons/ArrowDownwardTwoTone';
import AddComment from '@material-ui/icons/AddComment';
import Grid from '@material-ui/core/Grid'
import TimeAgo from 'timeago-react';
import { Link } from "react-router-dom";

const header = {
  height: '15%',
  paddingTop: '15px',
  paddingBottom: '18px',
  paddingLeft: '20px',
  paddingRight: '20px',
  margin: '0px',
};
const cAddress = {
  fontWeight: 'bold',
  fontSize: '12px',
  color: '#6A6A6A',
  display: 'inline-block',
  paddingTop: '0px',
  marginTop: '0px',
};
const date = {
  fontSize: '12px',
  color: 'grey',
  display: 'inline-block',
  paddingLeft: '4px',
  paddingTop: '0px',
  marginTop: '0px',
};
const comment = {
  fontWeight: 'bold',
  fontSize: '15px',
  paddingTop: '0px',
  paddingBottom: '0px',
  margin: '0px',

};
const address = {
  fontSize: '12px',
  color: 'grey',
  display: 'inline-block',
  textDecoration: 'none',
  paddingBottom: '0px',
  marginBottom: '0px',
};
const target = {
  fontSize: '12px',
  color: 'grey',
  display: 'inline-block',
  paddingBottom: '0px',
  marginBottom: '0px',
};

export default class Comment extends Component {
  render() {
    return (
      <Card className="comment" style={{ borderRadius: '10px', marginTop: '0px', marginBottom: '15px' }}>
        <Grid container direction="row" justify={"flex-start"} alignItems="center">
          <Grid item xs={1}>
            <Grid container direction={"column"} justify={"center"} alignItems="center">
              <Grid item >
                <IconButton onClick={this.props.upvote}>
                  <UpArrow />
                </IconButton>
              </Grid>
              <Grid item >
                {this.props.votes}
              </Grid>
              <Grid item >
                <IconButton onClick={this.props.downvote}>
                  <DownArrow />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={11}>
            <Grid container direction={"column"} >
              <Grid container direction="row">
                <Grid item >
                  <p style={comment}>{this.props.comment}</p>
                </Grid>
              </Grid>
              <Grid container direction="row">
                <Grid item >
                  <p style={target}>Target: {this.props.target}</p>
                </Grid>
              </Grid>
              <Grid container direction="row">
                <Grid item >
                  <a style={address} href={"https://ropsten.etherscan.io/address/" + this.props.address} target="_blank"> Address: {this.props.address} </a>
                </Grid>
              </Grid>
              <Grid container direction="row">
                <Link to={"/user/" + this.props.creator} style={{ textDecoration: 'none', color: 'black' }} key={this.props.creator}>
                  <Grid item>
                    <p style={cAddress}>Created by {this.props.creator}</p>
                  </Grid>
                </Link>
              </Grid>
              <Grid container direction="row">
                <Link to={"/comment/" + this.props.address} style={{ textDecoration: 'none', color: 'black' }} key={this.props.address}>
                  <Grid item >
                    <IconButton aria-label="add-comment">
                      <Badge badgeContent={this.props.commentReplies} color="secondary" >
                        <AddComment />
                      </Badge>
                    </IconButton>
                  </Grid>
                </Link>
                <Grid item>
                  <p style={date}><TimeAgo datetime={this.props.time} /></p>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card >
    )
  }
}
