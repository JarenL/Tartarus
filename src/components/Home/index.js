import React from 'react';
import styled from 'styled-components/macro';
import { Route, Switch } from 'react-router-dom';
import HomeMainSection from './MainSection';
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
import DrawerContainer from '../Drawer/Container';
import CombinedListContainer from '../Combined/Container';
import ComingSoon from '../shared/ComingSoon';
import CreateForumFormContainer from '../CreateForumForm/Container';
import AdminContainer from '../Admin/Container';

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
      <HomeMainSection>
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
          render={({ match }) => (
            <AdminContainer key={match.url} type={'info'} />
          )}
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
        />
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
      </HomeMainSection>
      <Divider />
      <SidebarWrapper>
        <Switch>
          <Route
            exact
            path='/'
            render={({ match }) => <SidebarContainer page={'front'} />}
          />
          <Route
            exact
            path='/admin'
            render={({ match }) => (
              <SidebarContainer page={'admin'} key={match.url} />
            )}
          />
          <Route
            exact
            path='/admin/admins'
            render={({ match }) => (
              <SidebarContainer page={'admin'} key={match.url} />
            )}
          />
          <Route
            exact
            path='/admin/admins/create'
            render={({ match }) => (
              <SidebarContainer page={'admin'} key={match.url} />
            )}
          />
          <Route
            exact
            path='/admin/info'
            render={({ match }) => (
              <SidebarContainer page={'admin'} key={match.url} />
            )}
          />
          <Route
            exact
            path='/admin/banned'
            render={({ match }) => (
              <SidebarContainer page={'admin'} key={match.url} />
            )}
          />
          <Route
            exact
            path='/admin/removed'
            render={({ match }) => (
              <SidebarContainer page={'admin'} key={match.url} />
            )}
          />
          <Route
            exact
            path='/admin/reports'
            render={({ match }) => (
              <SidebarContainer page={'admin'} key={match.url} />
            )}
          />
          <Route
            exact
            path='/createforum'
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
            exact
            path='/f/:forumName/createPost'
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
            path='/f/:forumName/banned'
            render={({ match }) => (
              <SidebarContainer
                key={match.url}
                forumName={match.params.forumName}
                page={'banned'}
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
            path='/u/:user/votes'
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
          <Route
            path='/u/:user/message'
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
      </SidebarWrapper>
    </Wrapper>
  );
};

export default Home;
