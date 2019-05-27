import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import moment from 'moment';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.foreground};
  // margin-top: 12px;
`;

const EventWrapper = styled.div`
  overflow-wrap: break-word;
  display: flex;
  border-left: none;
  padding: 8px;
  font-size: 12px;
  list-style-position: inside;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.normalText};
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  font-size: 15px;
  color: ${props => props.theme.accent};
  &:hover {
    color: ${props => props.theme.normalText};
    & > svg {
      color: ${props => props.theme.accent} !important;
    }
  }
`;

const ButtonWrapper = styled.div`
  align-self: flex-end;
`;

const getEvent = props => {
  console.log(props);
  const forumName = props.forumName;
  const event = props.event;
  switch (event.event) {
    case 'ForumCreated':
      return (
        <div>
          <StyledLink to={`/f/${forumName}`}>{forumName}</StyledLink>
          {' created by '}
          <StyledLink to={`/u/${props.web3.utils.toAscii(event.args.user)}`}>
            {props.web3.utils.toAscii(event.args.user)}
          </StyledLink>
          {` ${moment(event.args.time.c[0] * 1000).fromNow()}`}
        </div>
      );
    case 'ForumUpdated':
      return;
    case 'ModeratorCreated':
      return (
        <div>
          <StyledLink
            to={`/u/${props.web3.utils.toAscii(event.args.targetUser)}`}
          >
            {props.web3.utils.toAscii(event.args.targetUser)}
          </StyledLink>{' '}
          {' modded by '}
          <StyledLink to={`/u/${props.web3.utils.toAscii(event.args.user)}`}>
            {props.web3.utils.toAscii(event.args.user)}
          </StyledLink>
          {` ${moment(event.args.time.c[0] * 1000).fromNow()}`}
        </div>
      );
    case 'ModeratorUpdated':
      return;
    case 'ModeratorRemoved':
      return (
        <div>
          <StyledLink
            to={`/u/${props.web3.utils.toAscii(event.args.targetUser)}`}
          >
            {props.web3.utils.toAscii(event.args.targetUser)}
          </StyledLink>{' '}
          {' removed by '}
          <StyledLink to={`/u/${props.web3.utils.toAscii(event.args.user)}`}>
            {props.web3.utils.toAscii(event.args.user)}
          </StyledLink>
          {` ${moment(event.args.time.c[0] * 1000).fromNow()}`}
        </div>
      );
    case 'ModeratorPaid':
      return;
    case 'UserBanned':
      return;
    case 'UserUnbanned':
      return;
    case 'PostRemoved':
      return;
    case 'CommentRemoved':
      return;
    default:
      return;
  }
};

const ActivityItem = props => {
  return (
    <Wrapper>
      <EventWrapper>{getEvent(props)}</EventWrapper>
    </Wrapper>
  );
};

export default ActivityItem;
