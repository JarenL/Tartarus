import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import moment from 'moment';
import CloseButton from '../../Buttons/CloseButton';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.foreground};
  // margin-top: 12px;
`;

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
  font-size: 15px;
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

const ForumCreated = props => {
  console.log(props)
  return (
    <EventWrapper>
      <div>
        <StyledLink to={`/u/${props.user}`}>{props.user}</StyledLink>
        {' created '}
        <StyledLink to={`/f/${props.forum}`}>{props.forum}</StyledLink>
        {` ${moment(props.time).fromNow()}`}
      </div>
      <ButtonWrapper>
        <CloseButton
          size={18}
          onClick={() => props.handleClearNotification(props.transactionHash)}
        />
        {/* <DownButton
              size={18}
              onClick={() => this.props.toggleShowDetails()}
            /> */}
      </ButtonWrapper>
    </EventWrapper>
  );
};

export default ForumCreated;
