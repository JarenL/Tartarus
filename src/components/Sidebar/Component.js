import React from 'react';
import styled from 'styled-components/macro';
import CreateForumButton from './Buttons/CreateForumButton';
import ForumSidebarContainer from './Forum/Container';
import SubscriptionContainer from './Subscription/SubscriptionContainer';
import UserSidebarContainer from './User/Container';

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
  console.log(props);
  //create frontpage, user, forum, post sidebar component

  if (props.forumName !== undefined) {
    return (
      <Wrapper>
        <ForumSidebarContainer forumName={props.forumName} />
        <SubscriptionContainer />
      </Wrapper>
    );
  }
  if (props.username !== undefined) {
    return (
      <Wrapper>
        <UserSidebarContainer username={props.username} />
        <SubscriptionContainer />
      </Wrapper>
    );
  }
};

export default Sidebar;
