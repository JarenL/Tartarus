import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import styled from 'styled-components/macro';

const Blockie = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 3px;
`;

class UserBlockie extends React.Component {
  render() {
    console.log(this.props.user)
    return <Blockie src={makeBlockie(this.props.user)} />;
  }
}

export default UserBlockie;
