import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import moment from 'moment';
// import ReportItem from '../Reports/ReportItem';
// import UnbanButton from '../../../Buttons/Unban';
import AdminCreated from '../Events/AdminCreated';
import AdminUpdated from '../Events/AdminUpdated';
import AdminRemoved from '../Events/AdminRemoved';
import AdminPaid from '../Events/AdminPaid';
import UserBanned from '../Events/AdminBan';
import AdminUnban from '../Events/AdminUnban';
import CommentCreated from '../Events/CommentCreated';
import ForumCreated from '../Events/ForumCreated';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.foreground};
`;

const getEvent = props => {
  // console.log(props);
  const event = props.event;
  switch (event.event) {
    case 'AdminCreated':
      return (
        <AdminCreated
          targetUser={props.targetUser}
          user={props.user}
          time={props.time}
        />
      );
    case 'AdminUpdated':
      return (
        <AdminUpdated
          targetUser={props.targetUser}
          user={props.user}
          time={props.time}
        />
      );
    case 'AdminRemoved':
      return (
        <AdminRemoved
          targetUser={props.targetUser}
          user={props.user}
          time={props.time}
        />
      );
    case 'AdminPaid':
      return (
        <AdminPaid
          targetUser={props.targetUser}
          user={props.user}
          time={props.time}
          amount={props.amount}
        />
      );
    case 'AdminBan':
      return (
        <UserBanned
          targetUser={props.targetUser}
          user={props.user}
          time={props.time}
        />
      );
    case 'AdminUnban':
      return (
        <AdminUnban
          targetUser={props.targetUser}
          user={props.user}
          time={props.time}
        />
      );
    case 'ForumCreated':
      console.log(props);
      return (
        <ForumCreated
          user={props.web3.utils.toAscii(event.args.user)}
          forum={props.web3.utils.toAscii(event.args.forum)}
          time={event.args.time * 1000}
          transactionHash={event.args.transactionHash}
          handleClearNotification={props.handleClearNotification}
        />
      );
    case 'CommentCreated':
      return (
        <CommentCreated
          user={props.web3.utils.toAscii(event.args.user)}
          postId={event.args.postId}
          commentId={event.args.commentId}
          forum={event.args.forum}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
        />
      );
    default:
      return;
  }
};

const Notification = props => {
  return <Wrapper>{getEvent(props)}</Wrapper>;
};

export default Notification;
