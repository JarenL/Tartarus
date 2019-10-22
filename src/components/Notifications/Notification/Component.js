import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import moment from 'moment';
import AdminCreated from '../Events/AdminCreated';
import AdminUpdated from '../Events/AdminUpdated';
import AdminRemoved from '../Events/AdminRemoved';
import AdminPaid from '../Events/AdminPaid';
import AdminUnban from '../Events/AdminUnban';
import CommentCreated from '../Events/CommentCreated';
import ForumCreated from '../Events/ForumCreated';
import AdminBan from '../Events/AdminBan';
import CommentRemoved from '../Events/CommentRemoved';
import ModeratorBan from '../Events/ModeratorBan';
import ModeratorCreated from '../Events/ModeratorCreated';
import ModeratorPaid from '../Events/ModeratorPaid';
import ModeratorRemoved from '../Events/ModeratorRemoved';
import ModeratorUnban from '../Events/ModeratorUnban';
import PostRemoved from '../Events/PostRemoved';
import UserCreated from '../Events/UserCreated';
import UserUpdated from '../Events/UserUpdated';
import ModeratorUpdated from '../Events/ModeratorUpdated';
import UserWithdraw from '../Events/UserWithdraw';
import PostCreated from '../Events/PostCreated';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.foreground};
`;

const getEvent = props => {
  console.log(props);
  const event = props.event;
  switch (event.event) {
    case 'AdminBan':
      return (
        <AdminBan
          user={props.web3.utils.toAscii(event.args.user)}
          targetUser={props.web3.utils.toAscii(event.args.targetUser)}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
          removable={event.removable}
        />
      );
    case 'AdminUnban':
      return (
        <AdminUnban
          user={props.web3.utils.toAscii(event.args.user)}
          targetUser={props.web3.utils.toAscii(event.args.targetUser)}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
          removable={event.removable}
        />
      );
    case 'AdminCreated':
      return (
        <AdminCreated
          user={props.web3.utils.toAscii(event.args.user)}
          targetUser={props.web3.utils.toAscii(event.args.targetUser)}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
          removable={event.removable}
        />
      );
    case 'AdminUpdated':
      return (
        <AdminUpdated
          user={props.web3.utils.toAscii(event.args.user)}
          targetUser={props.web3.utils.toAscii(event.args.targetUser)}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
          removable={event.removable}
        />
      );
    case 'AdminRemoved':
      return (
        <AdminRemoved
          user={props.web3.utils.toAscii(event.args.user)}
          targetUser={props.web3.utils.toAscii(event.args.targetUser)}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
          removable={event.removable}
        />
      );
    case 'AdminPaid':
      return (
        <AdminPaid
          user={props.web3.utils.toAscii(event.args.user)}
          targetUser={props.web3.utils.toAscii(event.args.targetUser)}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
          amount={event.args.amount}
          removable={event.removable}
        />
      );
    case 'ForumCreated':
      console.log(props);
      return (
        <ForumCreated
          user={props.web3.utils.toAscii(event.args.user)}
          forum={props.web3.utils.toAscii(event.args.forum)}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
        />
      );
    case 'CommentCreated':
      console.log(props);
      return (
        <CommentCreated
          user={props.web3.utils.toAscii(event.args.user)}
          postId={event.args.postId}
          targetId={event.args.targetId}
          commentId={event.args.commentId}
          forum={event.args.forum}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
          userWatched={event.userWatched}
        />
      );
    case 'CommentRemoved':
      return (
        <CommentRemoved
          forum={props.web3.utils.toAscii(event.args.forum)}
          user={props.web3.utils.toAscii(event.args.user)}
          targetUser={props.web3.utils.toAscii(event.args.targetUser)}
          postId={event.args.postId}
          commentId={event.args.commentId}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
        />
      );
    case 'PostCreated':
      console.log(props);
      return (
        <PostCreated
          user={props.web3.utils.toAscii(event.args.user)}
          postId={event.args.postId}
          targetId={event.args.targetId}
          commentId={event.args.commentId}
          forum={props.web3.utils.toAscii(event.args.forum)}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
          userWatched={event.userWatched}
        />
      );
    case 'PostRemoved':
      return (
        <PostRemoved
          forum={props.web3.utils.toAscii(event.args.forum)}
          user={props.web3.utils.toAscii(event.args.user)}
          targetUser={props.web3.utils.toAscii(event.args.targetUser)}
          postId={event.args.postId}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
        />
      );
    case 'ModeratorBan':
      return (
        <ModeratorBan
          user={props.web3.utils.toAscii(event.args.user)}
          targetUser={props.web3.utils.toAscii(event.args.targetUser)}
          forum={props.web3.utils.toAscii(event.args.forum)}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
        />
      );
    case 'ModeratorCreated':
      return (
        <ModeratorCreated
          user={props.web3.utils.toAscii(event.args.user)}
          targetUser={props.web3.utils.toAscii(event.args.targetUser)}
          forum={props.web3.utils.toAscii(event.args.forum)}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
        />
      );
    case 'ModeratorPaid':
      return (
        <ModeratorPaid
          user={props.web3.utils.toAscii(event.args.user)}
          targetUser={props.web3.utils.toAscii(event.args.targetUser)}
          forum={props.web3.utils.toAscii(event.args.forum)}
          amount={event.args.amount}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
        />
      );
    case 'ModeratorRemoved':
      return (
        <ModeratorRemoved
          user={props.web3.utils.toAscii(event.args.user)}
          targetUser={props.web3.utils.toAscii(event.args.targetUser)}
          forum={props.web3.utils.toAscii(event.args.forum)}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
        />
      );
    case 'ModeratorUnban':
      return (
        <ModeratorUnban
          user={props.web3.utils.toAscii(event.args.user)}
          targetUser={props.web3.utils.toAscii(event.args.targetUser)}
          forum={props.web3.utils.toAscii(event.args.forum)}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
        />
      );
    case 'ModeratorUpdated':
      return (
        <ModeratorUpdated
          user={props.web3.utils.toAscii(event.args.user)}
          targetUser={props.web3.utils.toAscii(event.args.targetUser)}
          forum={props.web3.utils.toAscii(event.args.forum)}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
        />
      );
    case 'UserUpdated':
      return (
        <UserUpdated
          user={props.web3.utils.toAscii(event.args.user)}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
        />
      );
    case 'UserCreated':
      return (
        <UserCreated
          user={props.web3.utils.toAscii(event.args.user)}
          time={event.args.time * 1000}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
        />
      );
    case 'UserWithdraw':
      return (
        <UserWithdraw
          user={props.web3.utils.toAscii(event.args.user)}
          time={event.args.time * 1000}
          amount={props.web3.utils.fromWei(event.args.amount, 'ether')}
          transactionHash={event.transactionHash}
          handleClearNotification={props.handleClearNotification}
        />
      );
      case 'ReportPost':
          return (
            <ReportC web3={props.web3} event={props.event} username={props.username} />
          );
    default:
      return;
  }
};

const Notification = props => {
  return <Wrapper>{getEvent(props)}</Wrapper>;
};

export default Notification;
