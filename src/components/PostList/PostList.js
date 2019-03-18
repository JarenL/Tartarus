import React, { Component } from 'react';
import styled from 'styled-components/macro';
import PostListItem from './PostListItem';

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

export default class PostList extends Component {
  render() {
    const posts = this.props.posts.map(post => {
      return <PostListItem address={post.args.postAddress} />;
    });
    return <List>{posts}</List>;
  }
}
