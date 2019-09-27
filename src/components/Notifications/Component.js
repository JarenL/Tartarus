import React from 'react';
import Empty from '../../../shared/Empty';
import TartarusContract from '../../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../../shared/LoadingIndicator/Spinner';
import ReactList from 'react-list';
import NotificationItem from './NotificationItem';

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userEvents: [],
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  renderItem(index, key) {
    return (
      <ActivityItem
        key={key}
        tartarusAddress={this.props.tartarusAddress}
        event={this.state.moderatorEvents[index]}
        web3={this.props.web3}
        username={this.props.username}
      />
    );
  }

  render() {
    console.log(this.state.userEvents);
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.userEvents || this.state.userEvents.length === 0) {
      return <Empty />;
    } else {
      return (
        <ReactList
          itemRenderer={this.renderItem.bind(this)}
          length={this.state.userEvents.length}
          type='simple'
        />
      );
    }
  }
}

export default Notifications;
