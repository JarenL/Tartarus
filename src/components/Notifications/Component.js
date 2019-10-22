import React from 'react';
import ReactList from 'react-list';
import NotificationContainer from './Notification/Container';
import NotAuthorized from '../shared/NotAuthorized';
import Empty from '../shared/Empty';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';
import { updateUserNotifications } from '../../redux/actions/actions';

class Notifications extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     userEvents: [],
  //     loading: true
  //   };
  // }

  handleClearNotification = props => {
    console.log('remove notification');
    console.log(props);
    let newNotificationsArray = this.props.userSettings[this.props.username]
      .notifications;
    console.log(newNotificationsArray)
    for (var i = 0; i < newNotificationsArray.length; i++) {
      if (newNotificationsArray[i].transactionHash === props) {
        newNotificationsArray.splice(i, 1);
      }
    }
    let payload = {
      username: this.props.username,
      notifications: newNotificationsArray
      // notifications: []
    };
    this.props.dispatch(updateUserNotifications(payload));
  };

  handleClearAllNotifications = () => {
    let payload = {
      username: this.props.username,
      notifications: []
    };
    this.props.dispatch(updateUserNotifications(payload));
  };

  renderItem(index, key) {
    return (
      <NotificationContainer
        key={key}
        event={this.props.userSettings[this.props.username].notifications[key]}
        handleClearNotification={this.handleClearNotification}
      />
    );
  }

  render() {
    // console.log('user notifications');
    // console.log(this.props.userSettings[this.props.username].notifications);
    if (this.props.user !== this.props.username) {
      return <NotAuthorized />;
    } else {
      if (
        !this.props.userSettings[this.props.username].notifications ||
        this.props.userSettings[this.props.username].notifications.length === 0
      ) {
        return <Empty />;
      } else {
        return (
          <ReactList
            itemRenderer={this.renderItem.bind(this)}
            length={
              this.props.userSettings[this.props.username].notifications.length
            }
            type='simple'
          />
        );
      }
    }
  }
}

export default Notifications;
