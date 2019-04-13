import React, { Component } from 'react';
import Button from '../../shared/Button';
import styled from 'styled-components/macro';

const Unsubscribe = styled(Button)`
  border-radius: 2px 2px 0 0;
  padding: 16px;
  text-decoration: none;
  text-align: center;
`;

class UnsubscribeButton extends Component {
  render() {
    return (
      <Unsubscribe onClick={this.props.unsubscribeHandler}>
        Unsubscribe
      </Unsubscribe>
    );
  }
}

export default UnsubscribeButton;
