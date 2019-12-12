import React from 'react';
import TrendingItem from './TrendingItem';

const TrendingList = props => {
  const trending = props.forums.map((forum, index) => {
    return (
      <TrendingItem
        forumName={props.web3.utils.toAscii(Object.keys(forum)[0])}
        forumWeight={Math.floor(Object.values(forum)[0] * 100)}
      />
    );
  });
  return trending;
};

export default TrendingList;
