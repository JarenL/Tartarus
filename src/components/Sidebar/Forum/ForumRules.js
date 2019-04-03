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
  alignitems: 'center';
  padding: 12px;
  color: ${props => props.theme.mutedText};
`;

const Rules = styled.div`
  ${overflow};
  max-width: 800px;
  padding-bottom: 1px;
  height: 1.25em;
  font-size: 13px;
  color: ${props => props.theme.mutedText};
`;

const ButtonWrapper = styled.div`
  align-self: flex-end;
`;

const ForumRules = props => (
  <Wrapper>
    <HeaderWrapper>
      {'Rules'}
      <ButtonWrapper>
        <EditButton size={16} />
        {props.showRules ? (
          <UpButton size={18} onClick={props.toggleShowRules} />
        ) : (
          <DownButton size={18} onClick={props.toggleShowRules} />
        )}
      </ButtonWrapper>
    </HeaderWrapper>
    {props.showRules ? <Rules> {props.rules}</Rules> : null}
  </Wrapper>
);

export default ForumRules;
