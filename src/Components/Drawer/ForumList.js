import React, { Component } from 'react'
import ForumContainer from '../../Containers/ForumContainer'
import List from '@material-ui/core/List'

export default class ForumList extends Component {
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
      <div>
        {forumContainers}
      </div>
    )
  }
}
