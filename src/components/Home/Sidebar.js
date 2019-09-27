import React from 'react';
import styled from 'styled-components/macro';
import { Route, Switch } from 'react-router-dom';
import SidebarContainer from '../Sidebar/Container';

const Sidebar = () => {
  return (
    <Switch>
      <Route
        exact
        path='/'
        render={({ match }) => <SidebarContainer page={'front'} />}
      />
      <Route
        exact
        path='/search/:searchQuery'
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
        path='/u/:user/watched'
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
        path='/u/:user/notifications'
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
      {/* <Route
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
      /> */}
      {/* <Route
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
      /> */}
    </Switch>
  );
};

export default Sidebar;
