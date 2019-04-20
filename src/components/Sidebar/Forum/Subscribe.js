import React from 'react';
import Button from '../../shared/Button';
import styled from 'styled-components/macro';

const SubscribeButton = styled(Button)`
  border-radius: 0 0 0 0;
  padding: 16px;
  text-decoration: none;
  text-align: center;
`;

const Subscribe = props => {
  console.log(props);
  if (props.username === null) {
    return (
      <SubscribeButton onClick={props.subscribeHandler}>
        Subscribe
      </SubscribeButton>
    );
  } else {
    let index = props.userSettings[props.username].subscriptions.findIndex(
      forum => forum.forumName === props.forumName
    );
    if (index === -1) {
      return (
        <SubscribeButton onClick={props.subscribeHandler}>
          Subscribe
        </SubscribeButton>
      );
    } else {
      return (
        <SubscribeButton onClick={props.unsubscribeHandler}>
          Unsubscribe
        </SubscribeButton>
      );
    }
  }
};

export default Subscribe;
