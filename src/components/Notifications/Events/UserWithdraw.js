import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import moment from 'moment';
import CloseButton from '../../Buttons/CloseButton';
import Tip from '../../Buttons/Tip';

const EventWrapper = styled.div`
  overflow-wrap: break-word;
  display: flex;
  border-left: none;
  padding: 8px;
  font-size: 12px;
  list-style-position: inside;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.normalText};
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  font-size: 14px;
  color: ${props => props.theme.accent};
  &:hover {
    color: ${props => props.theme.normalText};
    & > svg {
      color: ${props => props.theme.accent} !important;
    }
  }
`;

const ButtonWrapper = styled.div`
  align-self: flex-end;
  justify-content: center;
  color: ${props => props.theme.mutedText};
`;

const UserWithdraw = props => {
  console.log(props.amount);
  return (
    <EventWrapper>
      <div>
        <StyledLink to={`/u/${props.user}`}>{props.user}</StyledLink>
        {' withdrew '}
        <StyledLink
          to={`blank`}
          target='_blank'
          onClick={event => {
            event.preventDefault();
            window.open(
              `https://ropsten.etherscan.io/tx/${props.transactionHash} `
            );
          }}
        >
          {props.amount}
          <i class='fab fa-ethereum' />
        </StyledLink>
        {` ${moment(props.time).fromNow()}`}
      </div>
      <ButtonWrapper>
        <CloseButton
          size={18}
          onClick={() => props.handleClearNotification(props.transactionHash)}
        />
      </ButtonWrapper>
    </EventWrapper>
  );
};

export default UserWithdraw;
