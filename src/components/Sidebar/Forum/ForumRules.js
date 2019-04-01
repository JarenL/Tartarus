import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import UpButton from '../Buttons/UpButton';
import DownButton from '../Buttons/DownButton';

const Wrapper = styled.div`
  ${wideFont};
  ${overflow};
  display: flex;
  justify-content: space-between;
  alignitems: 'center';
  padding: 12px;
  color: ${props => props.theme.mutedText};
`;

const ForumRules = props => (
  <Wrapper>
    {'Rules'}
    {props.showRules ? (
      <UpButton size={18} onClick={props.toggleShowRules} />
    ) : (
      <DownButton size={18} onClick={props.toggleShowRules} />
    )}
  </Wrapper>
);

export default ForumRules;
