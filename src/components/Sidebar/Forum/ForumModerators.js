import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import UpButton from '../../Buttons/UpButton';
import DownButton from '../../Buttons/DownButton';
import { Link } from 'react-router-dom';
import ModerateButton from '../../Buttons/Moderate';
import Author from '../../shared/Author';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.foreground};
  // margin-top: 12px;
`;

const HeaderWrapper = styled.div`
  ${wideFont};
  ${overflow};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  color: ${props => props.theme.mutedText};
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Moderators = styled.div`
  overflow-wrap: break-word;
  padding: 8px;
  margin-right: auto;
  font-size: 12px;
  list-style-position: inside;
  color: ${props => props.theme.normalText};
`;

const StyledLink = styled(Link)`
  list-style: none;
  text-decoration: none;
  color: ${props => props.theme.mutedText};
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

const Moderator = props => {
  const moderator = props.web3.utils.toAscii(props.moderator);
  return (
    <StyledLink to={`/u/${moderator}`}>
      <li>
        <Author
          creatorHex={props.moderator}
          username={moderator}
          isModerator={true}
        />
      </li>
    </StyledLink>
  );
};

const usernameToBytes32 = props => {
  let remainder = 66 - props.length;
  return props + '0'.repeat(remainder);
};

const ForumModerators = props => (
  <Wrapper>
    <HeaderWrapper>
      {'Moderators'}
      <ButtonWrapper>
        {props.moderators != null &&
        props.moderators.includes(
          usernameToBytes32(props.web3.utils.fromAscii(props.username))
        ) ? (
          <StyledLink to={`${props.forumName}/moderate`}>
            <ModerateButton size={18} />
          </StyledLink>
        ) : null}
        {props.showModerators ? (
          <UpButton size={18} onClick={props.toggleShowModerators} />
        ) : (
          <DownButton size={18} onClick={props.toggleShowModerators} />
        )}
      </ButtonWrapper>
    </HeaderWrapper>
    {props.showModerators ? (
      <Moderators>
        {props.moderators !== null ? (
          <ul>
            {props.moderators.map(function(moderator) {
              return <Moderator moderator={moderator} web3={props.web3} />;
            })}
          </ul>
        ) : (
          'None'
        )}
      </Moderators>
    ) : null}
  </Wrapper>
);

export default ForumModerators;
