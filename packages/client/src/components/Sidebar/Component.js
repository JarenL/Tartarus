import React from 'react';
import styled from 'styled-components/macro';
import ForumSidebarContainer from './Forum/Container';
import UserSidebarContainer from './User/Container';
import FrontSidebarContainer from './Front/Container';
import AboutContainer from './About/AboutContainer';
import ModerateSidebarContainer from './Moderate/Container';
import Divider from './Divider';
import AdminSidebarContainer from './Admin/Container';

const Wrapper = styled.div`
  position: sticky;
  // top: 60px;
  display: flex;
  flex-direction: column;
  // flex-basis: 240px;
  width: 100%;
  height: 100%;
  // margin-left: 24px;
  // border: 1px solid ${props => props.theme.border};
  border-radius: 2px;

  // @media (max-width: 768px) {
  //   display: none;
  // }
`;

const Sidebar = props => {
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
    case 'admin':
      console.log('admin');
      return (
        <Wrapper>
          <AdminSidebarContainer createAdmin={props.createAdmin} />
          {/* <SubscriptionContainer /> */}
        </Wrapper>
      );
    default:
      return (
        <Wrapper>
          <FrontSidebarContainer />
          {/* <SubscriptionContainer /> */}
          <Divider />
          <AboutContainer />
        </Wrapper>
      );
  }
};

export default Sidebar;
