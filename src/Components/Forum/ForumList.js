import React, { Component } from 'react'
import ForumContainer from './ForumContainer'
import List from '@material-ui/core/List'
import { Route, Link, MemoryRouter } from "react-router-dom";


export default class ForumList extends Component {
  render() {
    const forumContainers = this.props.forums.map(forum => {
      return (
        <Link to={"/forum/" + forum.address} style={{ textDecoration: 'none' }}>
        <div key={forum.address} onClick={() => this.props.changeForum(forum)}>
          <ForumContainer
            address={forum.address}
            name={forum.name} >
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
