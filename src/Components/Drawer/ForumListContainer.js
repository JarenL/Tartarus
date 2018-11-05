import React, { Component } from 'react';
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import FrontPageListItem from './FrontPageListItem'
import ForumList from './ForumList'
import {
  setCurrentForum, setCurrentForumAddress
} from '../../actions/actions'


class ForumListContainer extends Component {
  changeForum = (forum) => {
    console.log("forum clicked")
    console.log(forum.name)
    this.props.dispatch(setCurrentForum(forum.name))
    this.props.dispatch(setCurrentForumAddress(forum.address))
  }
  render() {
    return (
      <div>
        <FrontPageListItem changeForum={this.changeForum}/>
        <Divider />
        <ForumList changeForum={this.changeForum} forums={this.props.forums}/>
      </div>

    );
  }
}

export default connect()(ForumListContainer);