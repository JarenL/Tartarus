import React from 'react';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import TrendingIcon from './TrendingIcon';

const TrendingWrapper = styled.div`
  ${wideFont};
  ${overflow};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  color: ${props => props.theme.mutedText};
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

const ButtonWrapper = styled.div`
  align-self: flex-end;
`;

const TrendingItem = props => {
  return (
    <TrendingWrapper>
      <Item to={`/f/${props.forumName}`}>{props.forumName}</Item>
      <ButtonWrapper>
        <TrendingIcon size={14} />
        {`${props.forumWeight}%`}
      </ButtonWrapper>
    </TrendingWrapper>
  );
};

export default TrendingItem;