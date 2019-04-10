import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import UpButton from '../Buttons/UpButton';
import DownButton from '../Buttons/DownButton';
import EditButton from '../Buttons/EditButton';

const Wrapper = styled.aside`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid ${props => props.theme.border};

  @media (max-width: 768px) {
    display: none;
  }
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

const ButtonWrapper = styled.div`
  align-self: flex-end;
`;

const ForumModerators = props => (
  <Wrapper>
    <HeaderWrapper>
      {'Moderators'}
      <ButtonWrapper>
        <EditButton size={14} />
        {props.showModerators ? (
          <UpButton size={18} onClick={props.toggleShowModerators} />
        ) : (
          <DownButton size={18} onClick={props.toggleShowModerators} />
        )}
      </ButtonWrapper>
    </HeaderWrapper>
  </Wrapper>
);

export default ForumModerators;
