import React from 'react';
import styled from 'styled-components/macro';
import { Route, Switch } from 'react-router-dom';
import HomeMainSection from './MainSection';
import { connect } from 'react-redux';

// import CategoryMenuContainer from '../CategoryMenu/Container';
import CategoryMenu from '../CategoryMenu/Component';
import PostListContainer from '../PostList/PostListContainer';
// import PostDetailContainer from '../PostDetail/Container';
import SidebarContainer from '../Sidebar/Component';
import PostDetail from '../PostDetail/Component';
import ForumPostListContainer from '../Forum/ForumPostListContainer';
import UserSidebar from '../User/UserSidebar';

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
  if (props.currentUserAddress === 0) {
    return (
      <Wrapper>
        <HomeMainSection>
          <Route component={CategoryMenu} />
          <Route exact path='/' component={PostListContainer} />
          <Route
            exact
            path='/f/:forumAddress'
            render={({ match }) => (
              <ForumPostListContainer
                forumAddress={match.params.forumAddress}
              />
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
            exact
            path='/p/:postAddress'
            render={({ match }) => (
              <PostDetail
                forumAddress={match.params.forum}
                postAddress={match.params.postAddress}
              />
            )}
          />
        </HomeMainSection>

        <Switch>
          <Route
            exact
            path='/u/:userAddress'
            render={({ match }) => <UserSidebar {...match} />}
          />
        </Switch>
      </Wrapper>
    );
  } else {
    return (
      <Wrapper>
        <HomeMainSection>
          <Route component={CategoryMenu} />
          <Route exact path='/' component={PostListContainer} />
          <Route
            exact
            path='/f/:forumAddress'
            render={({ match }) => (
              <ForumPostListContainer
                forumAddress={match.params.forumAddress}
              />
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
            exact
            path='/p/:postAddress'
            render={({ match }) => (
              <PostDetail
                forumAddress={match.params.forum}
                postAddress={match.params.postAddress}
              />
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
            path='/f/:forumAddress'
            render={({ match }) => <SidebarContainer {...match} />}
          />
          <Route
            exact
            path='/u/:userAddress'
            render={({ match }) => <UserSidebar {...match} />}
          />
        </Switch>
      </Wrapper>
    );
  }
};

function mapStateToProps(state) {
  return {
    web3: state.web3,
    currentUserAddress: state.accounts.currentUserAddress
  };
}

export default connect(mapStateToProps)(Home);
