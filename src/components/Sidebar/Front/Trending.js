//take average activity (posts / votes) of all forums over last week,
//compare last 12 hours to last week, pick 5 forums with largest above average activity

//
import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import { Link } from 'react-router-dom';
import UpButton from './TrendingUp';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderWrapper = styled.div`
  ${wideFont};
  ${overflow};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  color: ${props => props.theme.mutedText};
`;

const Forums = styled.div`
  overflow-wrap: break-word;
  border-left: none;
  padding: 8px;
  font-size: 12px;
  list-style-position: inside;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.normalText};
`;

const Item = styled(Link)`
  font-size: 12px;
  text-decoration: none;
  width: 100%;
  display: flex;
  align-items: center;
  color: ${props => props.theme.mutedText};
  ::after {
    left: -1px;
    top: 0;
    bottom: 0;
    border-left: 3px solid ${props => props.theme.accent};
  }
  &:hover {
    color: ${props => props.theme.accent};
    & > svg {
      color: ${props => props.theme.accent} !important;
    }
  }
`;

const TrendingWrapper = styled.div`
  ${wideFont};
  ${overflow};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  color: ${props => props.theme.mutedText};
`;

const ButtonWrapper = styled.div`
  align-self: flex-end;
`;

const TrendingItem = props => {
  return (
    <TrendingWrapper>
      <Item to={`/f/${props.forumName}`}>{props.forumName}</Item>
      <ButtonWrapper>
        <UpButton size={14} />
        {`${props.forumWeight}%`}
      </ButtonWrapper>
    </TrendingWrapper>
  );
};

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

const Trending = props => (
  <Wrapper>
    {console.log(props.forums)}
    <HeaderWrapper>{'Trending'}</HeaderWrapper>
    <Forums>
      {props.forums.length !== 0 ? (
        <TrendingList forums={props.forums} web3={props.web3} />
      ) : (
        'None'
      )}
    </Forums>
  </Wrapper>
);

export default Trending;
