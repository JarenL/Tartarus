import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import UpButton from '../Buttons/UpButton';
import DownButton from '../Buttons/DownButton';
import ReactHtmlParser from 'react-html-parser';

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

const ForumRules = props => (
  <Wrapper>
    <HeaderWrapper>
      {'Rules'}
      <ButtonWrapper>
        {props.showRules ? (
          <UpButton size={18} onClick={props.toggleShowRules} />
        ) : (
          <DownButton size={18} onClick={props.toggleShowRules} />
        )}
      </ButtonWrapper>
    </HeaderWrapper>
    {props.showRules ? <Rules> {ReactHtmlParser(props.rules)} </Rules> : null}
  </Wrapper>
);

export default ForumRules;
