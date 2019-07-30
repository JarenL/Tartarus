import React from 'react';
import styled from 'styled-components/macro';
import SubscriptionContainer from '../Sidebar/Subscription/SubscriptionContainer';
import UserSidebarContainer from '../Sidebar/User/Container';
import FrontSidebarContainer from '../Sidebar/Front/Container';
import TrendingContainer from '../Sidebar/Trending/TrendingContainer';
import AboutContainer from '../Sidebar/About/AboutContainer';
import ModerateSidebarContainer from '../Sidebar/Moderate/Container';
import ForumSidebarContainer from '../Sidebar/Forum/Container';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 240px;
  max-width: 240px;
  // border: 1px solid ${props => props.theme.border};
  border-radius: 2px;
  z-index: 10;

  // @media (max-width: 768px) {
  //   display: none;
  // }
`;

const DrawerSidebar = props => {
  console.log(props.page);
  //create frontpage, user, forum, post sidebar component

  switch (props.page) {
    case 'forum':
      return (
        <Wrapper>
          <ForumSidebarContainer forumName={props.forumName} />
          {/* <SubscriptionContainer /> */}
        </Wrapper>
      );
    case 'post':
      return (
        <Wrapper>
          <ForumSidebarContainer forumName={props.forumName} />
          {/* <SubscriptionContainer /> */}
        </Wrapper>
      );
    case 'user':
      return (
        <Wrapper>
          <UserSidebarContainer user={props.user} />
          {/* <SubscriptionContainer /> */}
        </Wrapper>
      );
    case 'moderate':
      console.log("moderate")
      return (
        <Wrapper>
          <ModerateSidebarContainer forumName={props.forumName} createModerator={props.createModerator} />
          {/* <SubscriptionContainer /> */}
        </Wrapper>
      );
    default:
      return (
        <Wrapper>
          <FrontSidebarContainer />
          {/* <SubscriptionContainer /> */}
          <TrendingContainer />
          <AboutContainer />
        </Wrapper>
      );
  }
};

export default DrawerSidebar;
