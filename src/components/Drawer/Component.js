import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import SidebarContainer from '../Sidebar/Container';
import styled from 'styled-components/macro';
import { Route, Switch } from 'react-router-dom';
import DrawerSidebar from './DrawerSidebar';

const styles = theme => ({
  drawerPaper: {
    position: 'fixed',
    marginTop: 50
    // width: '100%'
    // boxShadow: '2px 4px 40px #9E9E9E'
  }
});

const Wrapper = styled(Drawer)`
  // display: none;
  // @media (max-width: 768px) {
    // position: fixed;
    // top: 500px;
    // display: flex;
    // height: 100%;
    // width: 100%;
    // flex-direction: column;
    // flex-basis: 240px;
    // max-width: 240px;
    // margin-top: 50px;
    // flex-basis: 240px;
    // max-width: 240px;
    // border: 1px solid ${props => props.theme.border};
    // border-radius: 2px;
    box-shadow: "2px 4px 40px #9E9E9E";
  // }
`;

class AppDrawer extends Component {
  render() {
    if (this.props.drawerState) {
      const { classes } = this.props;
      console.log('drawer open');
      return (
        // <Wrapper>
        <Drawer
          variant='permanent'
          classes={{
            paper: classes.drawerPaper
          }}
        >
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
        </Drawer>
        // </Wrapper>
      );
    } else {
      return null;
    }
  }
}

AppDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AppDrawer);