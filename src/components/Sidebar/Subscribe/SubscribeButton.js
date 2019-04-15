import React, { Component } from 'react';
import Button from '../../shared/Button';
import styled from 'styled-components/macro';

const Subscribe = styled(Button)`
  border-radius: 2px 2px 0 0;
  padding: 16px;
  text-decoration: none;
  text-align: center;
`;

class SubscribeButton extends Component {
  render() {
    return (
      <Subscribe onClick={this.props.subscribeHandler}>Subscrbe</Subscribe>
    );
  }
}

export default SubscribeButton;
