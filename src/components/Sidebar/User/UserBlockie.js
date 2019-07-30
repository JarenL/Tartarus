import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import styled from 'styled-components/macro';

const Blockie = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 3px;
`;

class UserBlockie extends React.Component {
  render() {
    return <Blockie src={makeBlockie(this.props.user)} />;
  }
}

export default UserBlockie;
