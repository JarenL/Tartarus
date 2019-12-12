import React, { Component } from 'react';
import styled from 'styled-components/macro';
import ForumListItem from './ForumListItem';

const List = styled.ul`
  list-style: none;
  border: 1px solid ${props => props.theme.border};
  border-radius: 2px;

  @media (max-width: 768px) {
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
`;

export default class ForumList extends Component {
  render() {
    console.log(this.props.forums)
    const forums = this.props.forums.map(forum => {
      return <ForumListItem forumName={forum.args.forum} />;
    });
    return <List>{forums}</List>;
  }
}
