import React, { Component } from 'react'
import DrawerItemContainer from './DrawerItemContainer'
import { Link } from "react-router-dom";

export default class ForumList extends Component {
  render() {
    console.log(this.props.forums)
    const drawerItemContainers = this.props.forums.map(forum => {
      return (
        <Link to={"/forum/" + forum.address} style={{ textDecoration: 'none' }} key={forum.address}>
          <div onClick={() => this.props.changeForum(forum)} > 
            <DrawerItemContainer
              address={forum.address} >
            </DrawerItemContainer>
          </div>
        </Link>
      )
    });

    return (
      <div>
        {drawerItemContainers}
      </div>
    )
  }
}