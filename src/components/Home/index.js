import React from 'react';
import styled from 'styled-components/macro';
import { Route, Switch } from 'react-router-dom';
import HomeMainSection from './Main';
import PostListContainer from '../Post/PostList/Container';
import SidebarContainer from '../Sidebar/Container';
import PostDetail from '../Post/PostDetail/Container';
import CreatePostFormContainer from '../CreatePostForm/Container';
import SearchResultsContainer from '../Search/SearchResultsContainer';
import ReportPostContainer from '../Report/Post/ReportPostContainer';
import ReportCommentContainer from '../Report/Comment/ReportCommentContainer';
import CommentListContainer from '../Comment/CommentList/Container';
import ModerateContainer from '../Moderation/Moderate/Container';
import FilterContainer from '../Header/Filter/FilterContainer';
import DrawerContainer from '../Drawer/Container';
import CombinedListContainer from '../Combined/Container';
import ComingSoon from '../shared/ComingSoon';
import CreateForumFormContainer from '../CreateForumForm/Container';
import AdminContainer from '../Moderation/Admin/Container';
import Main from './Main';
import Sidebar from './Sidebar';

const Wrapper = styled.div`
  display: flex;
  position: relative;
  // align-items: flex-start;
  margin: 0 10vw;
  // margin: 0 24px;
  // margin-top: 18px;

  @media (max-width: 1024px) {
    margin: 0 5vw;
  }

  @media (max-width: 768px) {
    display: block;
    margin: 0;
  }
`;

const Divider = styled.div`
  display: flex;
  height: 100%;
  width: 24px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 240px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const Home = props => {
  return (
    <Wrapper>
      <DrawerContainer />
      <Main />
      <Divider />
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>
    </Wrapper>
  );
};

export default Home;
