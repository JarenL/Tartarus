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
import { Grid, Row, Col } from 'react-flexbox-grid';

const styles = theme => ({
  post: {
    display: "flex"
  },
  header: {
  },
  actions: {
    display: 'flex',
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  vote: {

  },
  avatar: {
    backgroundColor: red[500],
  },
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
          <Grid fluid>
            <Row style={{marginTop : -25, marginBottom: -20}}>
              <Col >
                <Col style={{marginLeft : -3, marginRight : 20}}>
                  <Row>
                    <IconButton aria-label="upvote">
                      <UpArrow />
                    </IconButton>
                  </Row>
                  <Row>
                    <IconButton aria-label="add-comment">
                      <Badge badgeContent={400} color="secondary" classes={{ badge: classes.badge }}>
                        <AddComment />
                      </Badge>
                    </IconButton>
                  </Row>
                </Col>
              </Col>
              <Col style={{marginTop : -10}}>
                <p> Address - {this.props.address}</p>
                <p> Creator - {this.props.creator}</p>
                <p> Time - {this.props.time}</p>
              </Col>
            </Row>
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

{/* <p>Address - {this.props.address}</p>
            <p>Creator Address - {this.props.creator}</p>
            <p>Time - {this.props.time}</p> */}