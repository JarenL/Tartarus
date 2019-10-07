import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { link } from './helpers';
import makeBlockie from 'ethereum-blockies-base64';

const StyledCreator = styled(Link)`
  ${link};

  font-weight: 500;
  color: ${props => props.theme.accent};
`;

const StyledMod = styled(Link)`
  ${link};

  font-weight: 500;
  color: ${props => props.theme.mod} !important;
  :hover {
    color: ${props => props.theme.accent};
  }
`;

const StyledAdmin = styled(Link)`
  ${link};
  font-weight: 500;
  color: ${props => props.theme.admin} !important;
  :hover {
    color: ${props => props.theme.accent};
  }
`;

const UserWrapper = styled.div`
  display: flex;
  flex-direction: row;
  // justify-content: center;
  // align-content: center;
`;

const Blockie = styled.img`
  display: block;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 3px;
  width: 12px;
  height: 12px;
  border-radius: 5px;
`;

const Author = props => {
  if (props.isAdmin)
    return (
      <UserWrapper>
        <Blockie src={makeBlockie(props.creatorHex)} />
        <StyledAdmin to={`/u/${props.username}`}>{props.username}</StyledAdmin>
      </UserWrapper>
    );
  if (props.isModerator)
    return (
      <UserWrapper>
        <Blockie src={makeBlockie(props.creatorHex)} />
        <StyledMod to={`/u/${props.username}`}>{props.username}</StyledMod>
      </UserWrapper>
    );
  return (
    <UserWrapper>
      <Blockie src={makeBlockie(props.creatorHex)} />
      <StyledCreator to={`/u/${props.username}`}>
        {props.username}
      </StyledCreator>
    </UserWrapper>
  );
};

export default Author;
