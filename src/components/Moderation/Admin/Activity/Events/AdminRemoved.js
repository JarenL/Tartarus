import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import moment from 'moment';

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

const AdminRemoved = props => {
  return (
    <EventWrapper>
      <div>
        <StyledLink to={`/u/${props.targetUser}`}>
          {props.targetUser}
        </StyledLink>
        {' removed by '}
        <StyledLink to={`/u/${props.user}`}>{props.user}</StyledLink>
        {` ${moment(props.time).fromNow()}`}
      </div>
    </EventWrapper>
  );
};

export default AdminRemoved;
