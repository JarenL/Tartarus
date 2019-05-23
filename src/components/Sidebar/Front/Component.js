import React, { Component } from 'react';
import styled from 'styled-components/macro';
import CreateForumButton from './CreateForum.js';
import { withRouter } from 'react-router-dom';
import LoadingTest from '../../shared/LoadingIndicator/LoadingTest.js';
import FrontHeader from './FrontHeader.js';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  // border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.foreground};
`;

class FrontSidebar extends Component {
  createForumHandler = () => {
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      this.props.history.push(`/createforum`);
    }
  };

  render() {
    return (
      <Wrapper>
        <CreateForumButton createForumHandler={this.createForumHandler} />
        <FrontHeader />
      </Wrapper>
    );
  }
}

export default withRouter(FrontSidebar);
