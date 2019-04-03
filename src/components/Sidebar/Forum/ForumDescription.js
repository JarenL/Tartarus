import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import UpButton from '../Buttons/UpButton';
import DownButton from '../Buttons/DownButton';

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

const Description = styled.div`
  ${overflow};
  max-width: 800px;
  padding-bottom: 1px;
  height: 1.25em;
  font-size: 13px;
  color: ${props => props.theme.mutedText};
`;

const ForumDescription = props => (
  <Wrapper>
    <HeaderWrapper>
      {'Description'}
      {props.showDescription ? (
        <UpButton size={18} onClick={props.toggleShowDescription} />
      ) : (
        <DownButton size={18} onClick={props.toggleShowDescription} />
      )}
    </HeaderWrapper>
    {props.showDescription ? (
      <Description> {props.description}</Description>
    ) : null}
  </Wrapper>
);

export default ForumDescription;
