import React, { Component } from 'react';
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import FrontPageListItem from './FrontPageListItem'
import {
  setCurrentForum, setCurrentForumAddress
} from '../../actions/actions'


class ForumList extends Component {
  changeForum = (forum) => {
    console.log("forum clicked")
    console.log(forum.name)
    this.props.dispatch(setCurrentForum(forum.name))
    this.props.dispatch(setCurrentForumAddress(forum.address))
  }
  render() {
    return (
      <div>
        <FrontPageListItem />
        <Divider />
        <ForumList changeForum={this.changeForum} />
      </div>

    );
  }
}

export default connect()(ForumList);