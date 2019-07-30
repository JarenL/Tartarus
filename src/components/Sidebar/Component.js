import React from 'react';
import styled from 'styled-components/macro';
import CreateForumButton from './Buttons/CreateForumButton';
import ForumSidebarContainer from './Forum/Container';
import SubscriptionContainer from './Subscription/SubscriptionContainer';
import UserSidebarContainer from './User/Container';
import FrontSidebarContainer from './Front/Container';
import TrendingContainer from './Trending/TrendingContainer';
import AboutContainer from './About/AboutContainer';
import ModerateSidebarContainer from './Moderate/Container';
import Divider from './Divider';

const Wrapper = styled.div`
  position: sticky;
  // top: 60px;
  display: flex;
  flex-direction: column;
  flex-basis: 240px;
  max-width: 240px;
  // margin-left: 24px;
  // border: 1px solid ${props => props.theme.border};
  border-radius: 2px;

  // @media (max-width: 768px) {
  //   display: none;
  // }
`;

const Sidebar = props => {
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
      console.log('moderate');
      return (
        <Wrapper>
          <ModerateSidebarContainer
            forumName={props.forumName}
            createModerator={props.createModerator}
          />
          {/* <SubscriptionContainer /> */}
        </Wrapper>
      );
    default:
      return (
        <Wrapper>
          <FrontSidebarContainer />
          {/* <SubscriptionContainer /> */}
          <Divider />
          <TrendingContainer />
          <Divider />
          <AboutContainer />
        </Wrapper>
      );
  }
};

export default Sidebar;
