import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import moment from 'moment';
import CloseButton from '../../Buttons/CloseButton';

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

const PostCreated = props => {
  return (
    <EventWrapper>
      <div>
        <StyledLink to={`/u/${props.user}`}>{props.user}</StyledLink>
        {' made a '}
        <StyledLink to={`/f/${props.forum}/p/${props.postId}`}>
          {' Post '}
        </StyledLink>
        {' in '}
        <StyledLink to={`/f/${props.forum}`}>{props.forum}</StyledLink>
        {` ${moment(this.props.time).fromNow()}`}
      </div>
      <ButtonWrapper>
        <CloseButton
          size={18}
          onClick={() =>
            this.props.handleClearNotification(this.props.transactionHash)
          }
        />
        {/* <DownButton
              size={18}
              onClick={() => this.props.toggleShowDetails()}
            /> */}
      </ButtonWrapper>
    </EventWrapper>
  );
};

export default PostCreated;
