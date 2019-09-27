import React from 'react';
import styled from 'styled-components/macro';
import { Route, Switch } from 'react-router-dom';
import PostListContainer from '../Post/PostList/Container';
import PostDetail from '../Post/PostDetail/Container';
import CreatePostFormContainer from '../CreatePostForm/Container';
import SearchResultsContainer from '../Search/SearchResultsContainer';
import ReportPostContainer from '../Report/Post/ReportPostContainer';
import ReportCommentContainer from '../Report/Comment/ReportCommentContainer';
import CommentListContainer from '../Comment/CommentList/Container';
import ModerateContainer from '../Moderation/Moderate/Container';
import FilterContainer from '../Header/Filter/FilterContainer';
import CombinedListContainer from '../Combined/Container';
import ComingSoon from '../shared/ComingSoon';
import CreateForumFormContainer from '../CreateForumForm/Container';
import AdminContainer from '../Moderation/Admin/Container';

const MainWrapper = styled.main`
  flex: 1;
  min-width: 0;
  @media (max-width: 768px) {
    margin: 6px;
  }
`;

const FilterWrapper = styled.div`
  display: none;
  position: sticky;
  top: 48px;
  width: 100%;
  @media (max-width: 768px) {
    display: flex;
    width: 100%;
  }
  @media (max-width: 425px) {
    top: 40px;
  }
`;

const Main = () => {
  return (
    <MainWrapper>
      <Route path='/createforum' component={CreateForumFormContainer} />
      <Route
        exact
        path='/'
        render={({ match }) => {
          return (
            <>
              <FilterWrapper>
                <FilterContainer />
              </FilterWrapper>
              <PostListContainer key={match.url} />
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
              <FilterWrapper>
                <FilterContainer />
              </FilterWrapper>
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
        path='/admin'
        render={({ match }) => (
          <AdminContainer key={match.url} type={'activity'} />
        )}
      />

      <Route
        exact
        path='/admin/admins'
        render={({ match }) => (
          <AdminContainer key={match.url} type={'admins'} />
        )}
      />

      <Route
        exact
        path='/admin/admins/create'
        render={({ match }) => (
          <AdminContainer key={match.url} type={'create'} />
        )}
      />

      <Route
        exact
        path='/admin/info'
        render={({ match }) => <AdminContainer key={match.url} type={'info'} />}
      />

      <Route
        exact
        path='/admin/banned'
        render={({ match }) => (
          <AdminContainer key={match.url} type={'banned'} />
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
        path='/f/:forumName/moderate/banned'
        render={({ match }) => (
          <ModerateContainer
            key={match.url}
            forumName={match.params.forumName}
            type={'banned'}
          />
        )}
      />

      <Route
        exact
        path='/f/:forumName/moderate/removed'
        render={({ match }) => (
          <ModerateContainer
            key={match.url}
            forumName={match.params.forumName}
            type={'removed'}
          />
        )}
      />

      <Route
        exact
        path='/f/:forumName/moderate/reports'
        render={({ match }) => (
          <ModerateContainer
            key={match.url}
            forumName={match.params.forumName}
            type={'reports'}
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
              <FilterWrapper>
                <FilterContainer />
              </FilterWrapper>
              <CombinedListContainer user={match.params.user} />
            </>
          );
        }}
      />
      <Route
        path='/u/:user/posts'
        render={({ match }) => {
          return (
            <>
              <FilterWrapper>
                <FilterContainer />
              </FilterWrapper>
              <PostListContainer user={match.params.user} />
            </>
          );
        }}
      />
      <Route
        path='/u/:user/comments'
        render={({ match }) => (
          <>
            <FilterWrapper>
              <FilterContainer />
            </FilterWrapper>
            <CommentListContainer user={match.params.user} disabled={true} />
          </>
        )}
      />
      <Route
        path='/u/:user/votes'
        render={({ match }) => (
          <>
            <FilterWrapper>
              <FilterContainer />
            </FilterWrapper>
            <PostListContainer user={match.params.user} votes={true} />
          </>
        )}
      />
      <Route
        path='/u/:user/saved'
        render={({ match }) => {
          return (
            <>
              <FilterWrapper>
                <FilterContainer />
              </FilterWrapper>
              <CombinedListContainer user={match.params.user} saved={true} />
            </>
          );
        }}
      />
      <Route
        path='/u/:user/watched'
        render={({ match }) => {
          return (
            <>
              <FilterWrapper>
                <FilterContainer />
              </FilterWrapper>
              <CombinedListContainer user={match.params.user} watched={true} />
            </>
          );
        }}
      />
      <Route
        path='/u/:user/notifications'
        render={({ match }) => {
          return (
            <>
              <FilterWrapper>
                <FilterContainer />
              </FilterWrapper>
              <CommentListContainer notifications={true} user={match.params.user} />
            </>
          );
        }}
      />
      {/* <Route
        path='/u/:user/messages'
        render={({ match }) => {
          return (
            <>
              <FilterWrapper>
                <FilterContainer />
              </FilterWrapper>
              <ComingSoon />
            </>
          );
        }}
      /> */}
      <Route
        path='/u/:user/message'
        render={({ match }) => {
          return (
            <>
              <FilterWrapper>
                <FilterContainer />
              </FilterWrapper>
              <ComingSoon />
            </>
          );
        }}
      />
    </MainWrapper>
  );
};

export default Main;
