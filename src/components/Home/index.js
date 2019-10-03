import React from 'react';
import styled from 'styled-components/macro';
import DrawerContainer from '../Drawer/Container';
import Main from './Main';
import Sidebar from './Sidebar';

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
      <Main />
      <Divider />
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>
    </Wrapper>
  );
};

export default Home;
