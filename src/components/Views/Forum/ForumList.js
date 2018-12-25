import React, { Component } from 'react'
import ForumContainer from './ForumContainer'
import { Link } from "react-router-dom";


export default class ForumList extends Component {
  render() {
    console.log(this.props.forums)
    const forumContainers = this.props.forums.map(forum => {
      return (
        <Link to={"/forum/" + forum.address} style={{ textDecoration: 'none' }} key={forum.address}>
          <div onClick={() => this.props.changeForum(forum)} > 
            <ForumContainer
              drawer={this.props.drawer}
              address={forum.address} >
            </ForumContainer>
          </div>
        </Link>
      )
    });

    return (
      <div>
        {forumContainers}
      </div>
    )
  }
}
