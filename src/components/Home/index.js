import React from 'react';
import styled from 'styled-components/macro';
import { Route, Switch } from 'react-router-dom';
import HomeMainSection from './MainSection';
import CategoryMenu from '../CategoryMenu/Component';
import PostListContainer from '../Post/PostList/Container';
import SidebarContainer from '../Sidebar/Container';
import PostDetail from '../Post/PostDetail/Container';
import CreatePostFormContainer from '../CreatePostForm/Container';
import SearchResultsContainer from '../Search/SearchResultsContainer';
import ReportPostContainer from '../Report/Post/ReportPostContainer';
import ReportCommentContainer from '../Report/Comment/ReportCommentContainer';
import CommentListContainer from '../Comment/CommentList/Container';
import ModerateContainer from '../Moderate/Container';
import FilterContainer from '../Header/Filter/FilterContainer';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 0 10vw;
  // margin: 0 24px;
  margin-top: 18px;

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
        {/* <Route exact path='/' component={PostListContainer} /> */}
        <Route
          exact
          path='/'
          render={({ match }) => {
            return (
              <>
              <FilterContainer />
              <PostListContainer
                key={match.url}
              />
              </>
            );
          }}
        />
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
              <>
              <FilterContainer />
              <PostListContainer
                key={match.url}
                forumName={match.params.forumName}
              />
              </>
            );
          }}
        />
        <Route
          exact
          path='/f/:forumName/p/:postId'
          render={({ match }) => (
            <PostDetail
              forumName={match.params.forumName}
              postId={match.params.postId}
            />
          )}
        />

        <Route
          exact
          path='/f/:forumName/p/:postId/report'
          render={({ match }) => (
            <ReportPostContainer
              forumName={match.params.forumName}
              postId={match.params.postId}
            />
          )}
        />

        <Route
          exact
          path='/f/:forumName/p/:postId/c/:commentId/report'
          render={({ match }) => (
            <ReportCommentContainer
              forumName={match.params.forumName}
              postId={match.params.postId}
              commentId={match.params.commentId}
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
          path='/f/:forumName/moderate'
          render={({ match }) => (
            <ModerateContainer
              key={match.url}
              forumName={match.params.forumName}
              type={'activity'}
            />
          )}
        />

        <Route
          exact
          path='/f/:forumName/moderate/moderators'
          render={({ match }) => (
            <ModerateContainer
              key={match.url}
              forumName={match.params.forumName}
              type={'moderators'}
            />
          )}
        />

        <Route
          exact
          path='/f/:forumName/moderate/moderators/create'
          render={({ match }) => (
            <ModerateContainer
              key={match.url}
              forumName={match.params.forumName}
              type={'create'}
            />
          )}
        />

        <Route
          exact
          path='/f/:forumName/moderate/info'
          render={({ match }) => (
            <ModerateContainer
              key={match.url}
              forumName={match.params.forumName}
              type={'info'}
            />
          )}
        />

        <Route
          exact
          path='/u/:user'
          render={({ match }) => {
            return (

            <>
            <FilterContainer />
            <PostListContainer user={match.params.user} />
            </>
            )
          }}

        />
        <Route
          path='/u/:user/posts'
          render={({ match }) => {
            return (

            <>
            <FilterContainer />
            <PostListContainer user={match.params.user} />
            </>
            )
          }}        />
        <Route
          path='/u/:user/comments'
          render={({ match }) => (
            <CommentListContainer user={match.params.user} />
          )}
        />
        <Route
          path='/u/:user/saved'
          render={({ match }) => {
            return (

            <>
            <FilterContainer />
            <PostListContainer user={match.params.user} />
            </>
            )
          }}        />
      </HomeMainSection>
      <Switch>
        <Route
          exact
          path='/'
          render={({ match }) => <SidebarContainer page={'front'} />}
        />
        <Route
          exact
          path='/f/:forumName'
          render={({ match }) => (
            <SidebarContainer
              key={match.url}
              forumName={match.params.forumName}
              page={'forum'}
            />
          )}
        />
        <Route
          path='/f/:forumName/p/:postId'
          render={({ match }) => (
            <SidebarContainer
              key={match.url}
              forumName={match.params.forumName}
              postId={match.params.postId}
              page={'post'}
            />
          )}
        />

        <Route
          exact
          path='/f/:forumName/moderate'
          render={({ match }) => (
            <SidebarContainer
              key={match.url}
              forumName={match.params.forumName}
              page={'moderate'}
            />
          )}
        />

        <Route
          exact
          path='/f/:forumName/moderate/moderators'
          render={({ match }) => (
            <SidebarContainer
              key={match.url}
              forumName={match.params.forumName}
              page={'moderate'}
              createModerator={true}
            />
          )}
        />

        <Route
          exact
          path='/f/:forumName/moderate/moderators/create'
          render={({ match }) => (
            <SidebarContainer
              key={match.url}
              forumName={match.params.forumName}
              page={'moderate'}
            />
          )}
        />

        <Route
          exact
          path='/f/:forumName/moderate/info'
          render={({ match }) => (
            <SidebarContainer
              key={match.url}
              forumName={match.params.forumName}
              page={'moderate'}
            />
          )}
        />
        <Route
          exact
          path='/f/:forumName/moderate/banned'
          render={({ match }) => (
            <SidebarContainer
              key={match.url}
              forumName={match.params.forumName}
              page={'moderate'}
            />
          )}
        />

        <Route
          exact
          path='/f/:forumName/moderate/removed'
          render={({ match }) => (
            <SidebarContainer
              key={match.url}
              forumName={match.params.forumName}
              page={'moderate'}
            />
          )}
        />

        <Route
          exact
          path='/f/:forumName/moderate/reports'
          render={({ match }) => (
            <SidebarContainer
              key={match.url}
              forumName={match.params.forumName}
              page={'moderate'}
            />
          )}
        />

        <Route
          exact
          path='/u/:user'
          render={({ match }) => {
            return (
              <SidebarContainer
                key={match.url}
                user={match.params.user}
                page={'user'}
              />
            );
          }}
        />
        <Route
          path='/u/:user/posts'
          render={({ match }) => {
            return (
              <SidebarContainer
                key={match.url}
                user={match.params.user}
                page={'user'}
              />
            );
          }}
        />
        <Route
          path='/u/:user/comments'
          render={({ match }) => {
            return (
              <SidebarContainer
                key={match.url}
                user={match.params.user}
                page={'user'}
              />
            );
          }}
        />
        <Route
          path='/u/:user/saved'
          render={({ match }) => {
            return (
              <SidebarContainer
                key={match.url}
                user={match.params.user}
                page={'user'}
              />
            );
          }}
        />
        <Route
          path='/u/:user/messages'
          render={({ match }) => {
            return (
              <SidebarContainer
                key={match.url}
                user={match.params.user}
                page={'user'}
              />
            );
          }}
        />
      </Switch>
    </Wrapper>
  );
};

export default Home;
