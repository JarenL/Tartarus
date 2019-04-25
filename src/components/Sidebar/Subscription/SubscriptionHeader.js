import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import UpButton from '../Buttons/UpButton';
import DownButton from '../Buttons/DownButton';
import EditButton from '../Buttons/EditButton';

const Header = styled.span`
  ${wideFont};
  display: flex;
  justify-content: space-between;
  alignitems: 'center';
  padding: 12px;
  color: ${props => props.theme.mutedText};
  border-bottom: 1px solid ${props => props.theme.border};
`;

const ButtonWrapper = styled.div`
  align-self: flex-end;
`;

const SubscriptionHeader = props => (
  <Header>
    {'circles'}
    {props.forumLength !== 1 ? (
      <ButtonWrapper>
        {props.showSubscriptions ? (
          <EditButton size={16} onClick={props.toggleEditSubscriptions} />
        ) : null}
        {props.showSubscriptions ? (
          <UpButton size={18} onClick={props.toggleShowSubscriptions} />
        ) : (
          <DownButton size={18} onClick={props.toggleShowSubscriptions} />
        )}
      </ButtonWrapper>
    ) : null}
  </Header>
);

export default SubscriptionHeader;
