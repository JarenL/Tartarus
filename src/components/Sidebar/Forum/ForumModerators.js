import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import UpButton from '../Buttons/UpButton';
import DownButton from '../Buttons/DownButton';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.foreground};
  margin-top: 24px;
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
  border-left: none;
  padding: 8px;
  font-size: 12px;
  list-style-position: inside;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.normalText};
`;

const ModeratorLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.accent};
  &:hover {
    color: ${props => props.theme.normalText};
    & > svg {
      color: ${props => props.theme.normalText} !important;
    }
  }
`;

const ButtonWrapper = styled.div`
  align-self: flex-end;
`;

const Moderator = props => {
  const moderator = props.web3.utils.toAscii(props.moderator);
  return <ModeratorLink to={`/u/${moderator}`}>{moderator}</ModeratorLink>;
};

const ForumModerators = props => (
  <Wrapper>
    <HeaderWrapper>
      {'Moderators'}
      <ButtonWrapper>
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
