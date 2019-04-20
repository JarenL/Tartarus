import React from 'react';
import styled from 'styled-components/macro';
import { Route, Switch } from 'react-router-dom';
import HomeMainSection from './MainSection';
import { connect } from 'react-redux';
import CategoryMenu from '../CategoryMenu/Component';
import PostListContainer from '../PostList/PostListContainer';
import SidebarContainer from '../Sidebar/Container';
import PostDetail from '../PostDetail/Container';
import UserSidebar from '../Sidebar/User/UserContainer';
import CreatePostFormContainer from '../CreatePostForm/Container';
import SearchResultsContainer from '../Search/SearchResultsContainer';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 0 10vw;

  @media (max-width: 1024px) {
    margin: 0 5vw;
  }

  @media (max-width: 768px) {
    display: block;
    margin: 0;
  }
`;

const Home = props => {
  return (
    <Wrapper>
      <HomeMainSection>
        <Route component={CategoryMenu} />
        <Route exact path='/' component={PostListContainer} />
        <Route
          exact
          path='/search/:search'
          render={({ match }) => (
            <SearchResultsContainer search={match.params.search} />
          )}
        />
        <Route
          exact
          path='/f/:forumName'
          render={({ match }) => {
            return (
              <PostListContainer
                key={match.url}
                forumName={match.params.forumName}
              />
            );
          }}
        />
        <Route
          exact
          path='/p/:postId'
          render={({ match }) => (
            <PostDetail
              forumName={match.params.forumName}
              postId={match.params.postId}
            />
          )}
        />
        <Route
          exact
          path='/f/:forumName/createpost'
          render={({ match }) => (
            <CreatePostFormContainer forumName={match.params.forumName} />
          )}
        />
        <Route
          exact
          path='/u/:username'
          render={({ match }) => (
            <PostListContainer username={match.params.username} />
          )}
        />
        <Route
          path='/u/:username/posts'
          render={({ match }) => (
            <PostListContainer username={match.params.username} />
          )}
        />
        <Route
          path='/u/:username/comments'
          render={({ match }) => (
            <PostListContainer username={match.params.username} />
          )}
        />
        <Route
          path='/u/:username/saved'
          render={({ match }) => (
            <PostListContainer username={match.params.username} />
          )}
        />
      </HomeMainSection>
      <Switch>
        <Route
          exact
          path='/'
          render={({ match }) => <SidebarContainer {...match} />}
        />
        <Route
          exact
          path='/f/:forumName'
          render={({ match }) => (
            <SidebarContainer key={match.url} {...match} />
          )}
        />
        <Route
          path='/u/:username'
          render={({ match }) => <UserSidebar {...match} />}
        />
      </Switch>
    </Wrapper>
  );
};

function mapStateToProps(state) {
  return {
    web3: state.web3,
    username: state.user.username
  };
}

export default connect(mapStateToProps)(Home);
