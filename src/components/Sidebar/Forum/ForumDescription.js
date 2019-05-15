import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import UpButton from '../Buttons/UpButton';
import DownButton from '../Buttons/DownButton';
import ReactHtmlParser from 'react-html-parser';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.foreground};
  margin-top: 12px;
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

const Description = styled.div`
  overflow-wrap: break-word;
  border-left: none;
  padding: 8px;
  font-size: 12px;
  list-style-position: inside;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.mutedText};
`;

const ButtonWrapper = styled.div`
  align-self: flex-end;
`;

const ForumDescription = props => (
  <Wrapper>
    <HeaderWrapper>
      {'Description'}
      <ButtonWrapper>
        {props.showDescription ? (
          <UpButton size={18} onClick={props.toggleShowDescription} />
        ) : (
          <DownButton size={18} onClick={props.toggleShowDescription} />
        )}
      </ButtonWrapper>
    </HeaderWrapper>
    {props.showDescription ? (
      <Description> {ReactHtmlParser(props.description)} </Description>
    ) : null}
  </Wrapper>
);

export default ForumDescription;
