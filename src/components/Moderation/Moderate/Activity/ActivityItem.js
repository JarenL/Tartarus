import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ReportItem from '../Reports/ReportItem';
import UnbanButton from '../../../Buttons/Unban';

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
  color: ${props => props.theme.mutedText};
`;

const getEvent = props => {
  console.log(props);
  const forumName = props.forumName;
  const event = props.event;
  switch (event.event) {
    case 'ForumCreated':
      return (
        <EventWrapper>
          <div>
            <StyledLink to={`/f/${forumName}`}>{forumName}</StyledLink>
            {' created by '}
            <StyledLink to={`/u/${props.web3.utils.toAscii(event.args.user)}`}>
              {props.web3.utils.toAscii(event.args.user)}
            </StyledLink>
            {` ${moment(event.args.time.c[0] * 1000).fromNow()}`}
          </div>
        </EventWrapper>
      );
    case 'ForumUpdated':
      return;
    case 'ModeratorCreated':
      return (
        <EventWrapper>
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
        </EventWrapper>
      );
    case 'ModeratorUpdated':
      return;
    case 'ModeratorRemoved':
      return (
        <EventWrapper>
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
        </EventWrapper>
      );
    case 'ModeratorPaid':
      return;
    case 'ModeratorBan':
      return (
        <EventWrapper>
          <div>
            <StyledLink
              to={`/u/${props.web3.utils.toAscii(event.args.targetUser)}`}
            >
              {props.web3.utils.toAscii(event.args.targetUser)}
            </StyledLink>{' '}
            {' banned by '}
            <StyledLink to={`/u/${props.web3.utils.toAscii(event.args.user)}`}>
              {props.web3.utils.toAscii(event.args.user)}
            </StyledLink>
            {` ${moment(event.args.time.c[0] * 1000).fromNow()}`}
          </div>
          <ButtonWrapper>
            <UnbanButton size={18} />
          </ButtonWrapper>
        </EventWrapper>
      );
    case 'ModeratorUnban':
      return (
        <EventWrapper>
          <div>
            <StyledLink
              to={`/u/${props.web3.utils.toAscii(event.args.targetUser)}`}
            >
              {props.web3.utils.toAscii(event.args.targetUser)}
            </StyledLink>{' '}
            {' unbanned by '}
            <StyledLink to={`/u/${props.web3.utils.toAscii(event.args.user)}`}>
              {props.web3.utils.toAscii(event.args.user)}
            </StyledLink>
            {` ${moment(event.args.time.c[0] * 1000).fromNow()}`}
          </div>
        </EventWrapper>
      );
    case 'PostDeleted':
      return (
        <EventWrapper>
          <div>
            <StyledLink
              to={`/f/${props.web3.utils.toAscii(event.args.forum)}/p/${
                event.args.postId
              }`}
            >
              {/* {props.web3.utils.toAscii(event.args.targetUser)} */}
              {'Post'}
            </StyledLink>{' '}
            {' deleted by '}
            <StyledLink to={`/u/${props.web3.utils.toAscii(event.args.user)}`}>
              {props.web3.utils.toAscii(event.args.user)}
            </StyledLink>
            {` ${moment(event.args.time.c[0] * 1000).fromNow()}`}
          </div>
        </EventWrapper>
      );
    case 'CommentDeleted':
      return (
        <EventWrapper>
          <div>
            <StyledLink
              to={`/f/${props.web3.utils.toAscii(event.args.forum)}/p/${
                event.args.postId
              }`}
            >
              {/* {props.web3.utils.toAscii(event.args.targetUser)} */}
              {'Comment'}
            </StyledLink>{' '}
            {' deleted by '}
            <StyledLink to={`/u/${props.web3.utils.toAscii(event.args.user)}`}>
              {props.web3.utils.toAscii(event.args.user)}
            </StyledLink>
            {` ${moment(event.args.time.c[0] * 1000).fromNow()}`}
          </div>
        </EventWrapper>
      );
    case 'ReportPost':
      return (
        <ReportItem web3={props.web3} event={props.event} username={props.username} />
        // <EventWrapper>
        //   <StyledLink
        //     to={`/f/${props.web3.utils.toAscii(event.args._forum)}/p/${
        //       event.args._postId
        //     }`}
        //   >
        //     {/* {props.web3.utils.toAscii(event.args.targetUser)} */}
        //     {'Comment'}
        //   </StyledLink>{' '}
        //   {' reported '}
        //   {/* <StyledLink to={`/u/${props.web3.utils.toAscii(event.args.user)}`}>
        //     {props.web3.utils.toAscii(event.args.user)}
        //   </StyledLink> */}
        //   {` ${moment(event.args.time.c[0] * 1000).fromNow()}`}
        // </EventWrapper>
      );
    case 'ReportComment':
      return (
        <ReportItem web3={props.web3} event={props.event} username={props.username} />
        // <EventWrapper>
        //   <div>
        //     <StyledLink
        //       to={`/f/${props.web3.utils.toAscii(event.args._forum)}/p/${
        //         event.args._postId
        //       }`}
        //     >
        //       {/* {props.web3.utils.toAscii(event.args.targetUser)} */}
        //       {'Comment'}
        //     </StyledLink>{' '}
        //     {' reported '}
        //     {/* <StyledLink to={`/u/${props.web3.utils.toAscii(event.args.user)}`}>
        //         {props.web3.utils.toAscii(event.args.user)}
        //       </StyledLink> */}
        //     {` ${moment(event.args.time.c[0] * 1000).fromNow()}`}
        //   </div>
        // </EventWrapper>
      );
    default:
      return;
  }
};

const ActivityItem = props => {
  return <Wrapper>{getEvent(props)}</Wrapper>;
};

export default ActivityItem;
