import React, { Component } from 'react';
import styled from 'styled-components/macro';

const Footer = styled.div`
  background-color: ${props => props.theme.foreground};
  display: flex;
  flex-grow: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

class DrawerFooter extends Component {
  render() {
    return <Footer />;
  }
}

export default DrawerFooter;
