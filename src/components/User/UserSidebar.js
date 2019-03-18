import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';
import UserSidebarList from './UserSidebarList';
import UserMessageButton from './UserMessageButton';

const Wrapper = styled.aside`
  display: flex;
  flex-direction: column;
  flex-basis: 240px;
  margin-left: 24px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 2px;
  background-color: ${props => props.theme.foreground};

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserSidebar = props => {
  console.log(props);
  if (props.params.userAddress !== props.userAddress) {
    return (
      <Wrapper>
        <UserMessageButton />
        <UserSidebarList path={props.url} />
      </Wrapper>
    );
  } else {
    return (
      <Wrapper>
        <UserSidebarList path={props.url} />
      </Wrapper>
    );
  }
};

function mapStateToProps(state) {
  return {
    currentUserAddress: state.accounts.currentUserAddress
  };
}

export default connect(mapStateToProps)(UserSidebar);
