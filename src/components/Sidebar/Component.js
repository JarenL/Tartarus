import React from 'react';
import styled from 'styled-components/macro';
import CreatePostButton from './Buttons/CreatePostButton';
import SubscribeContainer from './Buttons/Subscribe/SubscribeContainer';
import CreateForumButton from './Buttons/CreateForumButton';
import ForumContainer from './Forum/ForumContainer';
import SubscriptionContainer from './Subscription/SubscriptionContainer';

const Wrapper = styled.aside`
  position: sticky;
  top: 60px;
  display: flex;
  flex-direction: column;
  flex-basis: 240px;
  margin-left: 24px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 2px;
  background-color: ${props => props.theme.foreground};

  @media (max-width: 768px) {
    display: none;
  }
`;

const Sidebar = props => {
  if (props.user.userAddress === null || props.user.userAddress === undefined) {
    return null;
  } else {
    if (props.params.forumAddress !== undefined) {
      return (
        <Wrapper>
          <SubscribeContainer forumAddress={props.params.forumAddress} />
          <CreatePostButton forumAddress={props.params.forumAddress} />
          <ForumContainer forumAddress={props.params.forumAddress} />
          <SubscriptionContainer />
        </Wrapper>
      );
    } else {
      return (
        <Wrapper>
          <CreateForumButton />
          <SubscriptionContainer />
        </Wrapper>
      );
    }
  }
};

export default Sidebar;
