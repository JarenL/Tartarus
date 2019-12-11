import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { overflow, link } from '../../../shared/helpers';

const Wrapper = styled.div`
  display: flex;

  * {
    ${overflow};
    display: block;
    font-size: 15px;
    padding-bottom: 1px;
    line-height: 21px;
    font-weight: 500;
    text-decoration: none;
    color: ${props => props.theme.normalText};
    ${props => props.full && 'white-space: unset'};
  }

  &:hover {
    color: ${props => props.theme.accent};
    & > svg {
      color: ${props => props.theme.accent} !important;
    }
  }

  a {
    ${link({ underline: false })};
  }
`;

const PostContentTitle = props => (
  // <Wrapper full={props.full}>{renderTitle(props)}</Wrapper>
  <Wrapper full={props.full}>
    <Link to={`/f/${props.forumName}/p/${props.postId}`}>{props.title}</Link>
  </Wrapper>
);

export default PostContentTitle;
