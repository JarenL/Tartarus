import React, { Component } from 'react'
import List from '@material-ui/core/List';
import ForumContainer from '../../Containers/ForumContainer'

export default class Forum extends Component {
  render() {
    const forumContainers = this.props.forums.map(forum => {
      return (
        <div key={forum.address} onClick={() => this.props.changeForum(forum)}>
          <ForumContainer
            address={forum.address}
            name={forum.name} />
        </div>
      )
    });
  
    return (
      <List>
        {forumContainers}
      </List>
    )
  }
}

