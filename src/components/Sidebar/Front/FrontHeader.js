import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.foreground};
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  color: ${props => props.theme.mutedText};
  border-bottom: 1px solid ${props => props.theme.border};
`;

const HeaderText = styled.div`
  ${wideFont};
  ${overflow};
  display: block;
  font-size: 12px;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.mutedText};
`;

const Description = styled.div`
  overflow-wrap: break-word;
  border-left: none;
  padding: 8px;
  font-size: 12px;
  list-style-position: inside;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.mutedText};
`;

const FrontHeader = props => (
  <Wrapper>
    <Header>
      <HeaderText>{'Welcome!'}</HeaderText>
    </Header>
    <Description>
      {
        'Tartarus is an open marketplace of ideas. Create, share, and discover content anonymously and uncensored!'
      }
    </Description>
  </Wrapper>
);

export default FrontHeader;
