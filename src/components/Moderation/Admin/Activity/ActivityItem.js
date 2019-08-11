import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ReportItem from '../Reports/ReportItem';
import UnbanButton from '../../../Buttons/Unban';
import AdminCreated from './Events/AdminCreated';
import AdminUpdated from './Events/AdminUpdated';
import AdminRemoved from './Events/AdminRemoved';
import AdminPaid from './Events/AdminPaid';
import UserBanned from './Events/AdminBan';
import AdminUnban from './Events/AdminUnban';

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
    case 'AdminCreated':
      return (
        <AdminCreated targetUser={props.targetUser} user={props.user} time={props.time} />
      );
    case 'AdminUpdated':
      return (
        <AdminUpdated targetUser={props.targetUser} user={props.user} time={props.time} />
      )
    case 'AdminRemoved':
      return (
        <AdminRemoved targetUser={props.targetUser} user={props.user} time={props.time} />
      );
    case 'AdminPaid':
      return (
        <AdminPaid targetUser={props.targetUser} user={props.user} time={props.time} amount={props.amount} />
      );
    case 'AdminBan':
      return (
        <UserBanned targetUser={props.targetUser} user={props.user} time={props.time} />
      )
    case 'AdminUnban':
      return (
        <AdminUnban targetUser={props.targetUser} user={props.user} time={props.time} />
      );
    // case 'ReportPost':
    //   return (
    //     <ReportItem web3={props.web3} event={props.event} username={props.username} />
    //   );
    // case 'ReportComment':
    //   return (
    //     <ReportItem web3={props.web3} event={props.event} username={props.username} />
    //   );
    default:
      return;
  }
};

const ActivityItem = props => {
  return <Wrapper>{getEvent(props)}</Wrapper>;
};

export default ActivityItem;
