import React from 'react';
import SubscriptionItem from './SubscriptionItem';

const mapCategories = forums =>
  forums.map((forum, index) => {
    if (forum === 'all') {
      return <SubscriptionItem key={index} name={'all'} />;
    } else {
      return (
        <SubscriptionItem
          key={index}
          name={forum.name}
          address={forum.address}
        />
      );
    }
  });

const SubscriptionList = props =>
  mapCategories([
    'all',
    ...props.userSettings[props.userAddress].subscriptions
  ]);

export default SubscriptionList;
