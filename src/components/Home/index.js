import React from 'react';
import styled from 'styled-components/macro';
import { Route, Switch } from 'react-router-dom';
import HomeMainSection from './MainSection';
import { connect } from 'react-redux';
import CategoryMenu from '../CategoryMenu/Component';
import PostListContainer from '../PostList/PostListContainer';
import SidebarContainer from '../Sidebar/Container';
import PostDetail from '../PostDetail/Container';
import UserSidebar from '../User/UserContainer';
import CreatePostFormContainer from '../CreatePostForm/Container';
import UserListContainer from '../User/UserHistory';

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
  if (props.userAddress === null) {
    console.log(props);
    return (
      <Wrapper>
        <HomeMainSection>
          <Route component={CategoryMenu} />
          <Route exact path='/' component={PostListContainer} />
          <Route
            exact
            path='/f/:forumAddress'
            render={({ match }) => (
              <PostListContainer forumAddress={match.params.forumAddress} />
            )}
          />
          <Route
            exact
            path='/u/:username'
            render={({ match }) => (
              <PostListContainer username={match.params.username} />
            )}
          />
          {/* <Route
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
          /> */}
          <Route
            exact
            path='/p/:postAddress'
            render={({ match }) => (
              <PostDetail postAddress={match.params.postAddress} />
            )}
          />
          <Route
            exact
            path='/search'
            render={({ match }) => (
              <PostDetail postAddress={match.params.postAddress} />
            )}
          />
        </HomeMainSection>
        <Route
          exact
          path='/u/:username'
          render={({ match }) => <UserSidebar {...match} />}
        />
        <Route
          path='/u/:username/posts'
          render={({ match }) => <UserSidebar {...match} />}
        />
        <Route
          exact
          path='/u/:username/comments'
          render={({ match }) => <UserSidebar {...match} />}
        />
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
              <PostListContainer
                key={match.url}
                forumAddress={match.params.forumAddress}
              />
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
          <Route
            exact
            path='/f/:forumAddress/createpost'
            render={({ match }) => (
              <CreatePostFormContainer
                forumAddress={match.params.forumAddress}
              />
            )}
          />
          <Route
            exact
            path='/u/:username'
            render={({ match }) => (
              <UserListContainer username={match.params.username} />
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
  }
};

function mapStateToProps(state) {
  return {
    web3: state.web3,
    userAddress: state.user.userAddress
  };
}

export default connect(mapStateToProps)(Home);
