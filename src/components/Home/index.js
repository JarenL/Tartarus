import React from 'react';
import styled from 'styled-components/macro';
import { Route, Switch } from 'react-router-dom';
import HomeMainSection from './MainSection';
import { connect } from 'react-redux';

// import CategoryMenuContainer from '../CategoryMenu/Container';
import CategoryMenu from '../CategoryMenu/Component';
import PostListContainer from '../PostList/PostListContainer';
// import PostDetailContainer from '../PostDetail/Container';
import SidebarContainer from '../Sidebar/Container';
import PostDetail from '../PostDetail/Container';
import UserSidebar from '../User/UserSidebar';
import CreatePostFormContainer from '../CreatePostForm/Container';

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
        <Route
          exact
          path='/u/:userAddress'
          render={({ match }) => <UserSidebar {...match} />}
        />
        <Route
          path='/u/:userAddress/posts'
          render={({ match }) => <UserSidebar {...match} />}
        />
        <Route
          exact
          path='/u/:userAddress/comments'
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
          {/* <Route
            exact
            path='/u/:userAddress'
            render={({ match }) => <UserSidebar {...match} />}
          /> */}
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
