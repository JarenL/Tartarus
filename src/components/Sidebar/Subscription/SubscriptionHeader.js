import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import UpButton from '../Buttons/UpButton';
import DownButton from '../Buttons/DownButton';

const Header = styled.span`
  ${wideFont};
  display: flex;
  justify-content: space-between;
  alignitems: 'center';
  padding: 12px;
  color: ${props => props.theme.mutedText};
`;

const SubscriptionHeader = props => (
  <Header>
    {'subscriptions'}
    {props.showCategories ? (
      <UpButton size={18} onClick={props.toggleShowCategories} />
    ) : (
      <DownButton size={18} onClick={props.toggleShowCategories} />
    )}
  </Header>
);

export default SubscriptionHeader;
